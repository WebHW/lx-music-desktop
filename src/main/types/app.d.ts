/* eslint-disable no-var */
// import { Event as WinMainEvent } from '@main/modules/winMain/event'
// import { Event as WinLyricEvent } from '@main/modules/winLyric/event'
import { type AppType } from '@main/event'

interface Lx {
  appSetting: LX.AppSetting
  hotKey: {
    enable: boolean
    config: LX.HotKeyConfigAll
    state: LX.HotKeyState
  }
  /**
   * 是否红绿灯关闭
   */
  isTrafficLightClose: boolean
  /**
   * 是否跳过托盘退出
   */
  isSkipTrayQuit: boolean
  /**
   * main window 是否关闭
   */
  // mainWindowClosed: boolean
  event_app: AppType
  theme: LX.ThemeSetting
}

declare global {
  // var isDev: boolean
  var envParams: LX.EnvParams
  var staticPath: string
  var lxDataPath: string
  var lxOldDataPath: string
  var lx: Lx

}


