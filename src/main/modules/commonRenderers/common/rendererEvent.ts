import { mainHandle, mainOn } from '@common/mainIpc'
import { CMMON_EVENT_NAME } from '@common/ipcNames'
import { getFonts } from '@main/utils/fontManage'
// 公共操作事件（公共，只注册一次）
export default () => {
  mainHandle<LX.AppSetting>(CMMON_EVENT_NAME.get_app_setting, async() => {
    return global.lx.appSetting
  })
  mainHandle<Partial<LX.AppSetting>>(CMMON_EVENT_NAME.set_app_setting, async({ params: config }) => {
    global.lx.event_app.updated_config(config)
  })
}
