import { app } from 'electron'
import './utils/logInit'
import '@common/error'
import { initAppSetting } from '@main/app'

// 初始化应用
const init = () => {
  console.log('init')
  void initAppSetting()
    .then(() => {
    })
}

void app.whenReady().then(() => {
  // isLinux ? setTimeout(init, 300) : init()
  init()
})
