import { mainHandle } from '@common/mainIpc'
import { DISLIKE_EVENT_NAME } from '@common/ipcNames'

// 列表操作事件（公共，只注册一次）

export default () => {
  mainHandle<LX.Dislike.DislikeInfo>(DISLIKE_EVENT_NAME.get_dislike_music_infos, async() => {
    return global.lx.worker.dbService.getDislikeListInfo()
  })
}