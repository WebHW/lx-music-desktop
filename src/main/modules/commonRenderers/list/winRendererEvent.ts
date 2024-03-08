import { PLAYER_EVENT_NAME } from '@common/ipcNames'

// 发送列表操作事件到渲染进程的注册方法
// 哪个渲染进程需要接收则引入此方法注册
export const registerRendererEvents = (sendEvent: <T=any>(name: string, params?: T | undefined) => void) => {
  const list_data_overwrite = async(listData: LX.List.ListActionDataOverwrite) => {
    sendEvent<LX.List.ListActionDataOverwrite>(PLAYER_EVENT_NAME.list_data_overwire, listData)
  }

  const list_create = async(position: number, listInfos: LX.List.UserListInfo[]) => {
    sendEvent<LX.List.ListActionAdd>(PLAYER_EVENT_NAME.list_add, { position, listInfos })
  }

  const list_remove = async(ids: string[]) => {
    sendEvent<LX.List.ListActionRemove>(PLAYER_EVENT_NAME.list_remove, ids)
  }

  const list_update = async(lists: LX.List.ListActionUpdate) => {
    sendEvent<LX.List.ListActionUpdate>(PLAYER_EVENT_NAME.list_update, lists)
  }

  const list_update_position = async(ids: string[], position: number) => {
    sendEvent<LX.List.ListActionUpdatePosition>(PLAYER_EVENT_NAME.list_update_position, { ids, position })
  }


  global.lx.event_list.on('list_data_overwrite', list_data_overwrite)
  global.lx.event_list.on('list_create', list_create)
  global.lx.event_list.on('list_remove', list_remove)
  global.lx.event_list.on('list_update', list_update)
  global.lx.event_list.on('list_update_position', list_update_position)
  return () => {
    global.lx.event_list.off('list_data_overwrite', list_data_overwrite)
    global.lx.event_list.off('list_create', list_create)
    global.lx.event_list.off('list_remove', list_remove)
    global.lx.event_list.off('list_update', list_update)
    global.lx.event_list.off('list_update_position', list_update_position)
  }
}
