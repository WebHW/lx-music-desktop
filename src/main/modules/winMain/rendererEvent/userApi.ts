import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import { mainHandle } from '@common/ipcMain'
import {
  importApi,
} from '@main/modules/userApi'
import { sendEvent } from '@main/modules/winMain/main'

export default () => {
  mainHandle<string, LX.UserApi.ImportUserApi>(WIN_MAIN_RENDERER_EVENT_NAME.import_user_api, async({ params: script }) => {
    return importApi(script)
  })
}
