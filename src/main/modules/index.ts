
import registerWinMain from './winMain'
let isRegistered = false
export default () => {
  if (isRegistered) return
  registerWinMain()
  isRegistered = true
}
