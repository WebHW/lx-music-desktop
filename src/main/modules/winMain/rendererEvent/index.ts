
import { registerRendererEvents as common } from '@main/modules/commonRenderers/common'
import { registerRendererEvents as list } from '@main/modules/commonRenderers/list'
import { registerRendererEvents as dislike } from '@main/modules/commonRenderers/dislike'
import { sendEvent } from '../main'
import hotKey from './hotKey'

import userApi from './userApi'
import app, { sendConfigChange } from './app'

export * from './app'
export * from './hotKey'
export * from './userApi'

let isInitialized = false
export default () => {
  if (isInitialized) return
  isInitialized = true
  common(sendEvent)
  list(sendEvent)
  dislike(sendEvent)
  app()
  hotKey()
  userApi()
  global.lx.event_app.on('updated_config', (keys, setting) => {
    sendConfigChange(setting)
  })
}
