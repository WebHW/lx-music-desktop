
import { createWindow } from './main'

export default () => {
  global.lx.event_app.on('app_inited', () => {
    createWindow()
  })
}

export * from './main'
export * from './rendererEvent'
