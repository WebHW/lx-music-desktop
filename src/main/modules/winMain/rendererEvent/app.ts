import { app } from 'electron'
import { mainHandle, mainOn } from '@common/mainIpc'
import { quitApp } from '@main/app'
import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import {
  maximize,
  minimize,
  setFullScreen,
  showWindow,
  toggleHide,
  toggleMinimize,
  closeWindow,
  showSelectDialog,
  showDialog,
  sendEvent,
  showSaveDialog,
  clearCache,
  getCacheSize,
  toggleDevTools,
  setWindowBounds,
  setProgressBar,
  setIngoreMouseEvents,
  setThumbarButtons,
} from '@main/modules/winMain'
import {
  getAllThemes, saveTheme, removeTheme,
} from '@main/utils'

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
  // 选择目录
  mainHandle<Electron.OpenDialogOptions, Electron.OpenDialogReturnValue>(WIN_MAIN_RENDERER_EVENT_NAME.show_select_dialog, async({ params: option }) => {
    return showSelectDialog(option)
  })

  // 显示弹窗信息
  mainOn<Electron.MessageBoxSyncOptions>(WIN_MAIN_RENDERER_EVENT_NAME.show_dialog, ({ params }) => {
    showDialog(params)
  })

  // 显示保存弹窗
  mainHandle<Electron.SaveDialogOptions, Electron.SaveDialogReturnValue>(WIN_MAIN_RENDERER_EVENT_NAME.show_save_dialog, async({ params }) => {
    return showSaveDialog(params)
  })

  mainHandle(WIN_MAIN_RENDERER_EVENT_NAME.clear_cache, async() => {
    await clearCache()
  })

  mainHandle<number>(WIN_MAIN_RENDERER_EVENT_NAME.get_cache_size, async() => {
    return getCacheSize()
  })

  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.open_dev_tools, () => {
    toggleDevTools()
  })

  mainOn<Partial<Electron.Rectangle>>(WIN_MAIN_RENDERER_EVENT_NAME.set_window_size, ({ params }) => {
    setWindowBounds(params)
  })

  mainOn<LX.Player.ProgressBarOptions>(WIN_MAIN_RENDERER_EVENT_NAME.progress, ({ params }) => {
    setProgressBar(params.progress, {
      mode: params.mode ?? 'normal',
    })
  })

  mainOn<boolean>(WIN_MAIN_RENDERER_EVENT_NAME.set_ignore_mouse_events, ({ params: isIgnore }) => {
    isIgnore
      ? setIngoreMouseEvents(isIgnore, { forward: true })
      : setIngoreMouseEvents(false)
  })

  mainOn<LX.TaskBarButtonFlags>(WIN_MAIN_RENDERER_EVENT_NAME.player_action_set_buttons, ({ params }) => {
    setThumbarButtons(params)
  })

  mainOn(WIN_MAIN_RENDERER_EVENT_NAME.inited, () => {
    global.lx.event_app.main_window_inited()
  })

  mainHandle<{ themes: LX.Theme[], userTheme: LX.Theme[] }>(WIN_MAIN_RENDERER_EVENT_NAME.get_themes, async() => {
    return getAllThemes()
  })
  mainHandle<LX.Theme>(WIN_MAIN_RENDERER_EVENT_NAME.save_theme, async({ params: theme }) => {
    saveTheme(theme)
  })
  mainHandle<string>(WIN_MAIN_RENDERER_EVENT_NAME.remove_theme, async({ params: id }) => {
    removeTheme(id)
  })
}


export const sendFocus = () => {
  sendEvent(WIN_MAIN_RENDERER_EVENT_NAME.focus)
}

export const sendTaskbarButtonClick = (action: LX.Player.StatusButtonActions) => {
  sendEvent(WIN_MAIN_RENDERER_EVENT_NAME.player_action_on_button_click, action)
}
export const sendConfigChange = (setting: Partial<LX.AppSetting>) => {
  sendEvent(WIN_MAIN_RENDERER_EVENT_NAME.on_config_change, setting)
}
