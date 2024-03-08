import { mainHandle } from '@common/mainIpc'
import { PLAYER_EVENT_NAME } from '@common/ipcNames'

// 列表操作事件（公共，只注册一次）
export default () => {
  mainHandle<LX.List.UserListInfo[]>(PLAYER_EVENT_NAME.list_get, async() => {
    return global.lx.worker.dbService.getAllUserList()
  })
}
