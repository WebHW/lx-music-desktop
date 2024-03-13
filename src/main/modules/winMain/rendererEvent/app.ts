import { app } from 'electron'
import { mainHandle, mainOn } from '@common/mainIpc'
import { quitApp } from '@main/app'
import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import {
  maximize, minimize,
  setFullScreen, showWindow, toggleHide, toggleMinimize, closeWindow,
} from '@main/modules/winMain'

export default () => {
  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.quit, () => {
    quitApp()
  })
  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.min_toggle, () => {
    toggleMinimize()
  })
  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.hide_toggle, () => {
    toggleHide()
  })
  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.min, () => {
    minimize()
  })
  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.max, () => {
    maximize()
  })
  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.focus, () => {
    showWindow()
  })
  mainOn<boolean>(WIN_MAIN_RENDERER_EVENT_NAME.close, ({ params: isForce }) => {
    if (isForce) {
      app.exit(0)
      return
    }
    global.lx.isTrafficLightClose = true
    closeWindow()
  })

  // 全屏
  mainHandle<boolean, boolean>(WIN_MAIN_RENDERER_EVENT_NAME.fullscreen, ({ params: isFullScreen }) => {
    global.lx.event_app.main_window_fullscreen(isFullScreen)
    return setFullScreen(isFullScreen)
  })
}
