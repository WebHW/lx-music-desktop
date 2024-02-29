import initRendererEvent from './rendererEvent'
import { createWindow } from './main'

export default () => {
  global.lx.event_app.on('app_inited', () => {
    initRendererEvent()
    createWindow()
  })
}

export * from './main'
export * from './rendererEvent'
