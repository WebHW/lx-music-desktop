import { EventEmitter } from 'events'

// 兼容v2.3.0之前版本插入数字类型的ID导致其意外在末尾追加 .0 的问题，确保所有ID都是字符串类型

const fixListIdType = (lists: LX.List.UserListInfo[] | LX.List.UserListInfoFull[]) => {
  for (const list of lists) {
    if (typeof list.sourceListId == 'number') {
      list.sourceListId = String(list.sourceListId)
      if (typeof list.id == 'number') {
        list.id = String(list.id)
      }
    }
  }
}
export class Event extends EventEmitter {
  list_change() {
    this.emit('list_change')
  }

  /**
   * 覆盖整个列表数据
   * @param listData 列表数据
   * @param isRemote 是否属于远程操作
   */
  async list_data_overwrite(listData: MakeOptional<LX.List.ListDataFull, 'tempList'>, isRemote: boolean = false) {
    fixListIdType(listData.userList)
    await global.lx.worker.dbService.listDataOverwrite(listData)
    this.emit('list_data_overwrite', listData, isRemote)
    this.list_change()
  }
  /**
   * 批量创建列表
   * @param position 列表位置
   * @param lists 列表信息
   * @param isRemote 是否属于远程操作
  */

  async list_create(position: number, lists: LX.List.UserListInfo[], isRemote: boolean = false) {
    fixListIdType(lists)
    await global.lx.worker.dbService.createUserLists(position, lists)
    this.emit('list_create', position, lists, isRemote)
    this.list_change()
  }

  /**
   * 批量删除列表及列表那歌曲
   * @param ids 列表ids
   * @param isRemote 是否属于远程操作
   * */

  async list_remove(ids: string[], isRemote: boolean = false) {
    await global.lx.worker.dbService.removeUserLists(ids)
    this.emit('list_remove', ids, isRemote)
    this.list_change()
  }

  /**
   * 批量更新列表信息
   * @param lists 列表信息
   * @param isRemote 是否属于远程操作
   */
  async list_update(lists: LX.List.UserListInfo[], isRemote: boolean = false) {
    await global.lx.worker.dbService.updateUserLists(lists)
    this.emit('list_update', lists, isRemote)
    this.list_change()
  }

  /**
   * 批量更新列表位置
   * @param position 列表
   * @param ids 列表ids
   * @param isRemote 是否属于远程操作
   * */
  async list_update_position(position: number, ids: string[], isRemote: boolean = false) {
    await global.lx.worker.dbService.updateUserListsPosition(position, ids)
    this.emit('list_update_position', position, ids, isRemote)
    this.list_change()
  }

  /**
   * 批量添加歌曲到列表
   * @param listId 列表id
   * @param musicInfos 添加的歌曲信息
   * @param addMusicLocationType 添加在列表的位置
   * @param isRemote 是否属于远程操作
   * */

  async list_music_add(listId: string, musicInfos: LX.Music.MusicInfo[], addMusicLocationType: LX.AddMusicLocationType, isRemote: boolean = false) {
    await global.lx.worker.dbService.musicsAdd(listId, musicInfos, addMusicLocationType)
    this.emit('list_music_add', listId, musicInfos, addMusicLocationType, isRemote)
    this.list_change()
  }
}


type EventMethods = Omit<EventType, keyof EventEmitter>
declare class EventType extends Event {
  on<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  once<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  off<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
}
export type Type = Omit<EventType, keyof Omit<EventEmitter, 'on' | 'off' | 'once'>>
