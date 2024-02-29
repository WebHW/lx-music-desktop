import { sendEvent } from '@main/modules/winMain'
import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'

export const sendFocus = () => {
  sendEvent(WIN_MAIN_RENDERER_EVENT_NAME.focus)
}
