import { EventEmitter } from 'events'

export class Event extends EventEmitter {
  dislike_changed() {
    this.emit('dislike_changed')
  }

  /**
   * 批量添加歌曲到列表
   * @param dislikeId 列表id
   * @param musicInfos 添加的歌曲信息
   * @param addMusicLocationType 添加在到列表的位置
   * @param isRemote 是否属于远程操作
   */
  async dislike_music_add(musicInfo: LX.Dislike.DislikeMusicInfo[], isRemote: boolean = false) {
    // const changedIds =
    await global.lx.worker.dbService.dislikeInfoAdd(musicInfo)
    // await checkUpdateDislike(changedIds)
    this.emit('dislike_music_add', musicInfo, isRemote)
    this.dislike_changed()
  }
}


type EventMethods = Omit<EventType, keyof EventEmitter>
declare class EventType extends Event {
  on<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  once<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  off<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
}
export type Type = Omit<EventType, keyof Omit<EventEmitter, 'on' | 'off' | 'once'>>
