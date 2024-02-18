import { app } from 'electron'
const isLinux =false
function init() {
  
}
void app.whenReady().then(() => {
  isLinux ? setTimeout(init, 300) : init()
})
