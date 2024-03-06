
import registerWinMain from './winMain'
import registerAppMenu from './appMenu'
import registerTray from './tray'
import registerCommonRenderers from './commonRenderers'

let isRegistered = false
export default () => {
  if (isRegistered) return
  registerWinMain()
  registerCommonRenderers()
  registerAppMenu()
  registerTray()
  isRegistered = true
}
