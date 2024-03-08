import { app } from 'electron'
import './utils/logInit'
import '@common/error'
import {
  initGlobalData,
  initSingleInstanceHandle,
  applyElectronEnvParams,
  setUserDataPath,
  registerDeeplink,
  listenerAppEvent,
  initAppSetting,
} from '@main/app'
import { isLinux } from '@common/utils'
import registerModules from '@main/modules'

// 初始化应用
const init = () => {
  console.log('init')
  void initAppSetting()
    .then(() => {
      registerModules()
      global.lx.event_app.app_inited()
    })
}

initGlobalData()
initSingleInstanceHandle()
applyElectronEnvParams()
setUserDataPath()
registerDeeplink(init)
listenerAppEvent(init)
void app.whenReady().then(() => {
  isLinux ? setTimeout(init, 300) : init()
})
