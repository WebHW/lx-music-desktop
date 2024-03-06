
import path from 'node:path'
import { renameSync } from 'fs'
import { getTheme, initHotKey, initSetting, parseEnvParams } from './utils'
import defaultSetting from '@common/defaultSetting'
import { createAppEvent, createDislikeEvent, createListEvent } from '@main/event'
import createWorkers from './worker'
import { dialog, app, shell } from 'electron'
import { encodePath, openDirInExplorer } from '@common/utils/electron'
import { migrateDBData } from './utils/migrate'
import { log } from '@common/utils'
import { closeWindow, isExistWindow as isExistMainWindow, showWindow as showMainWindow } from './modules/winMain'
import { URL_SCHEME_RXP } from '@common/constants'
import { existsSync, mkdirSync } from 'original-fs'
import { navigationUrlWhiteList } from '@common/config'

export const initGlobalData = () => {
  const envParams = parseEnvParams()
  global.envParams = {
    cmdParams: envParams.cmdParams,
    deeplink: envParams.deeplink,
  }
  global.staticPath = process.env.NODE_ENV !== 'production'
    ? webpackStaticPath
    : path.join(encodePath(__dirname), 'static')
}

export const initSingleInstanceHandle = () => {
  // 单例应用程序
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
  }
  app.on('second-instance', (event, argv, cwd) => {
    for (const param of argv) {
      if (URL_SCHEME_RXP.test(param)) {
        global.envParams.deeplink = param
        break
      }
    }

    if (isExistMainWindow()) {
      if (global.envParams.deeplink)global.lx.event_app.deeplink(global.envParams.deeplink)
      else showMainWindow()
    } else {
      app.quit()
    }
  })
}

export const applyElectronEnvParams = () => {
  // Is disable hardware acceleration
  if (global.envParams.cmdParams.dha) app.disableHardwareAcceleration()
  if (global.envParams.cmdParams.dhmkh) app.commandLine.appendSwitch('disable-features', 'HardwareMediaKeyHandling')

  if (process.platform === 'linux')app.commandLine.appendSwitch('use-gl', 'desktop')

  app.commandLine.appendSwitch('wm - window - animations - disabled')

  app.commandLine.appendSwitch('--disable-gpu-sandbox')

  // proxy
  if (global.envParams.cmdParams['proxy-server']) {
    app.commandLine.appendSwitch('proxy-server', global.envParams.cmdParams['proxy-server'])
    app.commandLine.appendSwitch('proxy-bypass-list', global.envParams.cmdParams['proxy-bypass-list'] ?? '<local>')
  }
}

export const setUserDataPath = () => {
  // windows平台下如果应用目录下存在 portable 文件夹则将数据存在此文件下
  if (process.platform === 'win32') {
    const portablePath = path.join(app.getPath('exe'), '/portable')
    if (existsSync(portablePath)) {
      app.setPath('appData', portablePath)
      const appDataPath = path.join(portablePath, '/userData')
      if (!existsSync(appDataPath))mkdirSync(appDataPath)
      app.setPath('userData', appDataPath)
    }
  }

  const userDataPath = app.getPath('userData')
  global.lxOldDataPath = userDataPath
  global.lxDataPath = path.join(userDataPath, 'LxDatas')
  if (!existsSync(global.lxDataPath))mkdirSync(global.lxDataPath)
}

export const registerDeeplink = (startApp: () => void) => {
  if (process.env.NODE_ENV !== 'production' && process.platform === 'win32') {
    app.setAsDefaultProtocolClient('lxmusic', process.execPath, process.argv.slice(1))
  } else {
    app.setAsDefaultProtocolClient('lxmusic')
  }

  // deep link
  app.on('open-url', (event, url) => {
    if (!URL_SCHEME_RXP.test(url)) return
    event.preventDefault()
    global.envParams.deeplink = url
    if (isExistMainWindow()) {
      if (global.envParams.deeplink) global.lx.event_app.deeplink(global.envParams.deeplink)
      else showMainWindow()
    } else {
      startApp()
    }
  })
}

const initTheme = () => {
  global.lx.theme = getTheme()
  const themeConfigKeys = ['theme.id', 'theme.lightId', 'theme.darkId']
  global.lx.event_app.on('updated_config', (keys) => {
    let requireUpdate = false
    for (const key of keys) {
      if (themeConfigKeys.includes(key)) {
        requireUpdate = true
        break
      }
    }
    if (requireUpdate) {
      global.lx.theme = getTheme()
      global.lx.event_app.theme_change()
    }
  })
  global.lx.event_app.on('system_theme_change', () => {
    if (global.lx.appSetting['theme.id'] == 'auto') {
      global.lx.theme = getTheme()
      global.lx.event_app.theme_change()
    }
  })
}

let isInitialized = false
export const initAppSetting = async() => {
  if (!global.lx) {
    const config = await initHotKey()
    global.lx = {
      isTrafficLightClose: false,
      isSkipTrayQuit: false,
      // mainWindowClosed: true,
      event_app: createAppEvent(),
      event_list: createListEvent(),
      event_dislike: createDislikeEvent(),
      appSetting: defaultSetting,
      worker: createWorkers(),
      hotKey: {
        enable: true,
        config: {
          local: config.local,
          global: config.global,
        },
        state: new Map(),
      },
      theme: {
        shouldUseDarkColors: false,
        theme: {
          id: '',
          name: '',
          isDark: false,
          colors: {},
        },
      },
    }
  }

  if (!isInitialized) {
    let dbFileExists = await global.lx.worker.dbService.init(global.lxDataPath)
    if (dbFileExists === null) {
      const backPath = path.join(global.lxDataPath, `lx.data.db.${Date.now()}.bak`)
      dialog.showMessageBoxSync({
        type: 'warning',
        message: 'Database verify failed',
        detail: `数据库表结构校验失败，我们将把有问题的数据库备份到：${backPath}\n若此问题导致你的数据丢失，你可以尝试从备份文件找回它们。\n\nThe database table structure verification failed, we will back up the problematic database to: ${backPath}\nIf this problem causes your data to be lost, you can try to retrieve them from the backup file.`,
      })
      renameSync(path.join(global.lxDataPath, 'lx.data.db'), backPath)
      openDirInExplorer(backPath)
      dbFileExists = await global.lx.worker.dbService.init(global.lxDataPath)
    }
    global.lx.appSetting = (await initSetting()).setting
    if (!dbFileExists) await migrateDBData().catch(err => { log.error(err) })
    initTheme()
  }
  // global.lx.theme = getTheme()

  isInitialized ||= true
}

export const listenerAppEvent = (startApp: () => void) => {
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      if (process.env.NODE_ENV !== 'production') {
        return
      }
      if (!navigationUrlWhiteList.some(url => url.test(navigationUrl))) {
        event.preventDefault()
      }
    })

    contents.setWindowOpenHandler(({ url }) => {
      if (!/^devtools/.test(url) && /^https?:\/\//.test(url)) {
        void shell.openExternal(url)
      }
      console.log(url)
      return { action: 'deny' }
    })

    contents.on('will-attach-webview', (event, webPreferences, params) => {
      delete webPreferences.preload

      webPreferences.nodeIntegration = false
      if (!navigationUrlWhiteList.some(url => url.test(params.src))) {
        event.preventDefault()
      }
      contents.session.setSpellCheckerDictionaryDownloadURL('http://0.0.0.0')
    })
  })

  app.on('activate', () => {
    if (isExistMainWindow()) {
      showMainWindow()
    } else {
      startApp()
    }
  })
}


export const quitApp = () => {
  global.lx.isSkipTrayQuit = true
  closeWindow()
}
