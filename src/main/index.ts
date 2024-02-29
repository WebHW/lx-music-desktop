import { app } from 'electron'
import './utils/logInit'
import '@common/error'
import { initAppSetting } from '@main/app'
import { isLinux } from '@common/utils'
import registerModules from '@main/modules'

// 初始化应用
const init = () => {
  console.log('init')
  void initAppSetting()
    .then(() => {
      registerModules()
    })
}
void app.whenReady().then(() => {
  isLinux ? setTimeout(init, 300) : init()
})
