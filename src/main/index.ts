import { app } from 'electron'
import './utils/logInit'
import '@common/error'
import { initAppSetting } from '@main/app'
import { isLinux } from '@common/utils'
// 初始化应用
const init = () => {
  console.log('init')
  void initAppSetting()
    .then(() => {
      console.log('init1')
    })
}
void app.whenReady().then(() => {
  isLinux ? setTimeout(init, 300) : init()
})
