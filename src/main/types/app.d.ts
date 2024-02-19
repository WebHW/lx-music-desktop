/* eslint-disable no-var */
// import { Event as WinMainEvent } from '@main/modules/winMain/event'
// import { Event as WinLyricEvent } from '@main/modules/winLyric/event'
import { type AppType } from '@main/event'

interface Lx {
  /**
   * 是否红绿灯关闭
   */
  isTrafficLightClose: boolean
  /**
   * 是否跳过托盘退出
   */
  isSkipTrayQuit: boolean
  event_app: AppType
}

declare global {
  var lx: Lx
}


