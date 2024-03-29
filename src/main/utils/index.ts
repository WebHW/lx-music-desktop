
import getStore from '@main/utils/store'
import migrateSetting from '@common/utils/migrateSetting'
import { STORE_NAMES, URL_SCHEME_RXP } from '@common/constants'
import defaultHotKey from '@common/defaultHotKey'
import defaultSetting from '@common/defaultSetting'
import { migrateDataJson, migrateHotKey, migrateUserApi, parseDataFile } from './migrate'
import { nativeTheme } from 'electron'
import themes from '@common/theme/index.json'
import { isUrl } from '@common/utils'
import { throttle } from '@common/utils/common'
import { joinPath } from '@common/utils/nodejs'

export const parseEnvParams = (): { cmdParams: LX.CmdParams, deeplink: string | null } => {
  const cmdParams: LX.CmdParams = {}
  let deeplink = null
  const rx = /^-\w+/
  for (let param of process.argv) {
    if (URL_SCHEME_RXP.test(param)) {
      deeplink = param
    }

    if (!rx.test(param)) continue
    param = param.substring(1)
    let index = param.indexOf('=')
    if (index < 0) {
      cmdParams[param] = true
    } else {
      cmdParams[param.substring(0, index)] = param.substring(index + 1)
    }
  }
  return {
    cmdParams,
    deeplink,
  }
}

let userThemes: LX.Theme[]
export const getAllThemes = () => {
  userThemes ??= getStore(STORE_NAMES.THEME).get('themes') as (LX.Theme[] | null) ?? []
  return {
    themes,
    userThemes,
    dataPath: joinPath(global.lxDataPath, 'theme_images'),
  }
}

export const saveTheme = (theme: LX.Theme) => {
  const targetTheme = userThemes.find(item => item.id === theme.id)
  if (targetTheme)Object.assign(targetTheme, theme)
  else userThemes.push(theme)
  getStore(STORE_NAMES.THEME).set('themes', userThemes)
}

export const removeTheme = (theme: LX.Theme) => {
  const index = userThemes.findIndex(item => item.id === theme.id)
  if (index < 0) return
  userThemes.splice(index, 1)
  getStore(STORE_NAMES.THEME).set('themes', userThemes)
}

export const copyTheme = (theme: LX.Theme): LX.Theme => {
  return {
    ...theme,
    config: {
      ...theme.config,
      extInfo: { ...theme.config.extInfo },
      themeColors: { ...theme.config.themeColors },
    },
  }
}

type HotKeyType = 'local' | 'global'

const saveHotKeyConfig = throttle<[LX.HotKeyConfigAll]>((config: LX.HotKeyConfigAll) => {
  for (const key of Object.keys(config) as HotKeyType[]) {
    global.lx.hotKey.config[key] = config[key]
    getStore(STORE_NAMES.HOTKEY).set(key, config[key])
  }
})
export const saveAppHotKeyConfig = (config: LX.HotKeyConfigAll) => {
  saveHotKeyConfig(config)
}
export const getTheme = () => {
  // fs.promises.readdir()
  const shouldUseDarkColors = nativeTheme.shouldUseDarkColors
  let themeId = global.lx.appSetting['theme.id'] == 'auto'
    ? shouldUseDarkColors
      ? global.lx.appSetting['theme.darkId']
      : global.lx.appSetting['theme.lightId']
    : global.lx.appSetting['theme.id']
  // themeId = 'naruto'
  // themeId = 'pink'
  // themeId = 'black'
  let theme = themes.find(theme => theme.id == themeId)
  if (!theme) {
    userThemes = getStore(STORE_NAMES.THEME).get('themes') as LX.Theme[] | null ?? []
    theme = userThemes.find(theme => theme.id == themeId)
    if (theme) {
      if (theme.config.extInfo['--background-image'] != 'none') {
        theme = copyTheme(theme)
        theme.config.extInfo['--background-image'] =
          isUrl(theme.config.extInfo['--background-image'])
            ? `url(${theme.config.extInfo['--background-image']})`
            : `url(file:///${encodePath(joinPath(global.lxDataPath, 'theme_images', theme.config.extInfo['--background-image']))})`
      }
    } else {
      themeId = global.lx.appSetting['theme.id'] == 'auto' && shouldUseDarkColors ? 'black' : 'green'
      theme = themes.find(theme => theme.id == themeId) as LX.Theme
    }
  }

  const colors: Record<string, string> = {
    ...theme.config.themeColors,
    ...theme.config.extInfo,
  }

  return {
    shouldUseDarkColors,
    theme: {
      id: global.lx.appSetting['theme.id'],
      name: theme.name,
      isDark: theme.isDark,
      colors,
    },
  }
}

/**
 * 初始化设置
 */
export const initSetting = async() => {
  const electronStore_config = getStore(STORE_NAMES.APP_SETTINGS)
  let setting = electronStore_config.get('setting') as LX.AppSetting | undefined

  // migrate setting
  if (!setting) {
    const config = await parseDataFile<{ setting?: any }>('config.json')
    if (config?.setting) setting = config.setting as LX.AppSetting
    await migrateUserApi()
    await migrateDataJson()
  }

  return updateSetting(setting, true)
}

/**
 * 初始化快捷键设置
 */
export const initHotKey = async() => {
  const electronStore_hotKey = getStore(STORE_NAMES.HOTKEY)

  let localConfig = electronStore_hotKey.get('local') as LX.HotKeyConfig | null
  let globalConfig = electronStore_hotKey.get('global') as LX.HotKeyConfig | null

  if (globalConfig) {
    // 移除v2.2.0及之前设置的全局媒体快捷键注册
    if (globalConfig.keys.MediaPlayPause) {
      delete globalConfig.keys.MediaPlayPause
      delete globalConfig.keys.MediaNextTrack
      delete globalConfig.keys.MediaPreviousTrack
      electronStore_hotKey.set('global', globalConfig)
    }
  } else {
    //  migrate hotKey
    const config = await migrateHotKey()
    if (config) {
      localConfig = config.local
      globalConfig = config.global
    } else {
      localConfig = JSON.parse(JSON.stringify(defaultHotKey.local))
      globalConfig = JSON.parse(JSON.stringify(defaultHotKey.global))
    }

    electronStore_hotKey.set('local', localConfig)
    electronStore_hotKey.set('global', globalConfig)
  }

  return {
    local: localConfig as LX.HotKeyConfig,
    global: globalConfig as LX.HotKeyConfig,
  }
}

export const mergeSetting = (originSetting: LX.AppSetting, targetSetting: Partial<LX.AppSetting> | undefined): {
  setting: LX.AppSetting
  updatedSettingKeys: Array<keyof LX.AppSetting>
  updatedSetting: Partial<LX.AppSetting>
} => {
  let originSettingCopy: LX.AppSetting = { ...originSetting }
  const updatedSettingKeys: Array<keyof LX.AppSetting> = []
  const updatedSetting: Partial<LX.AppSetting> = {}
  // TODO
  return {
    setting: originSettingCopy,
    updatedSettingKeys,
    updatedSetting,
  }
}

export const openDevTools = (webContents: Electron.WebContents) => {
  webContents.openDevTools({
    mode: 'undocked',
  })
}

export const updateSetting = (setting?: Partial<LX.AppSetting>, isInit: boolean = false) => {
  const electronStore_config = getStore(STORE_NAMES.APP_SETTINGS)

  let originSetting: LX.AppSetting
  if (isInit) {
    setting &&= migrateSetting(setting)
    originSetting = { ...defaultSetting }
  } else originSetting = global.lx.appSetting

  const result = mergeSetting(originSetting, setting)

  result.setting.version = defaultSetting.version

  electronStore_config.set({ version: result.setting.version, setting: result.setting })
  return result
}


