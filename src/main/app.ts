
import { initHotKey, initSetting } from './utils'
import { createAppEvent } from '@main/event'

let isInitialized = false
export const initAppSetting = async() => {
  if (!global.lx) {
    const config = await initHotKey()
    global.lx = {
      isTrafficLightClose: false,
      isSkipTrayQuit: false,
      event_app: createAppEvent(),
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
    global.lx.appSetting = (await initSetting()).setting
  }

  isInitialized ||= true
}
