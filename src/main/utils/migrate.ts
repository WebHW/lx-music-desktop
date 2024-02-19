
import fs from 'node:fs'
import { checkPath, joinPath } from '@common/utils/nodejs'
import { log } from '@common/utils'
/**
 * 读取配置文件
 * @returns
 */
import { APP_EVENT_NAMES } from '@common/constants'
export const parseDataFile = async<T>(name: string): Promise<T | null> => {
  const path = joinPath(global.lxOldDataPath, name)
  if (await checkPath(path)) {
    try {
      return JSON.parse((await fs.promises.readFile(path)).toString())
    } catch (err) {
      log.error(err)
    }
  }
  return null
}
const hotKeyNameMap = {
  mainWindow: APP_EVENT_NAMES.winMainName,
  winLyric: APP_EVENT_NAMES.winLyricName,
} as const

const updateHotKeyTypeName = (config: LX.HotKeyConfig) => {
  for (const keyConfig of Object.values(config.keys)) {
    if (hotKeyNameMap[keyConfig.type as keyof typeof hotKeyNameMap]) keyConfig.type = hotKeyNameMap[keyConfig.type as keyof typeof hotKeyNameMap]
  }
}

/**
 * 迁移 v2.0.0 之前的 hotkey
 * @returns
 */
export const migrateHotKey = async() => {
  const oldConfig = await parseDataFile<LX.HotKeyConfigAll>('hotKey.json')
  if (oldConfig) {
    let localConfig: LX.HotKeyConfig
    let globalConfig: LX.HotKeyConfig
    updateHotKeyTypeName(oldConfig.local)
    updateHotKeyTypeName(oldConfig.global)

    localConfig = oldConfig.local
    globalConfig = oldConfig.global

    // 移除v1.0.1及之前设置的全局声音媒体快捷键接管
    if (globalConfig.keys.VolumeUp) {
      delete globalConfig.keys.VolumeUp
      delete globalConfig.keys.VolumeDown
      delete globalConfig.keys.VolumeMute
    }
    return {
      local: localConfig,
      global: globalConfig,
    }
  }
  return null
}
