
import path from 'node:path'
import { renameSync } from 'fs'
import { initHotKey, initSetting } from './utils'
import defaultSetting from '@common/defaultSetting'
import { createAppEvent, createListEvent, createDislikeEvent } from '@main/event'
import createWorkers from './worker'
import { dialog } from 'electron'
import { openDirInExplorer } from '@common/utils/electron'
import { migrateDBData } from './utils/migrate'

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
