
import { registerRendererEvents as common } from '@main/modules/commonRenderers/common'
import { registerRendererEvents as list } from '@main/modules/commonRenderers/list'
import { sendEvent } from '../main'

export * from './app'

let isInitialized = false
export default () => {
  if (isInitialized) return
  isInitialized = true
  common(sendEvent)
  list(sendEvent)
}
