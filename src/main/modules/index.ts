
import registerWinMain from './winMain'
import registerCommonRenderers from './commonRenderers'
let isRegistered = false
export default () => {
  if (isRegistered) return
  registerWinMain()
  registerCommonRenderers()
  isRegistered = true
}
