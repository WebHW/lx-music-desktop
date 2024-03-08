import initRendererEvent, { handleKeyDown, hotKeyConfigUpdate } from './rendererEvent'
import { APP_EVENT_NAMES } from '@common/constants'
import { HOTKEY_COMMON } from '@common/hotKey'
import { quitApp } from '@main/app'
import { createWindow, minimize, toggleHide, toggleMinimize } from './main'


export default () => {
  global.lx.event_app.on('app_inited', () => {
    initRendererEvent()
    createWindow()

    global.lx.event_app.on('hot_key_down', ({ type, key }) => {
      let info = global.lx.hotKey.config.global.keys[key]
      if (info?.type === APP_EVENT_NAMES.winMainName) return
      switch (info.action) {
        case HOTKEY_COMMON.close.action:
          quitApp()
          break
        case HOTKEY_COMMON.hide_toggle.action
          toggleHide()
          break
        case HOTKEY_COMMON.min.action:
          minimize()
          break
        case HOTKEY_COMMON.min_toggle.action:
          toggleMinimize()
          break
        default:
          handleKeyDown(type, key)
          break
      }
    })
  })
}

export * from './main'
export * from './rendererEvent'
