declare namespace LX {
  namespace List {

    type ListActionDataOverwrite = MakeOptional<LX.List.ListDataFull, 'template'>
    type ListActionRemove = string[]

    interface UserListInfo {
      id: string
      name: string
      // list: LX.Music.MusicInfo[]
      source?: LX.OnlineSource
      sourceListId?: string
      // position?: number
      locationUpdateTime: number | null
    }
    interface ListActionMusicRemove {
      listId: string
      ids: string[]
    }

    interface MusicInfoMeta_local extends MusicInfoMetaBase {
      filePath: string
      ext: string
    }

    interface MusicInfoBase<S=LX.Source> {
      id: string
      name: string
      singer: string
      source: S
      interval: string | null
      meta: MusicInfoMeta_local
    }

    interface MusicInfoLocal extends MusicInfoBase<'local'> {
      meta: MusicInfoMeta_local
    }

    type MusicInfoOnline = MusicInfo_online_common | MusicInfo_kg | MusicInfo_tx | MusicInfo_mg
    type MusicInfo = MusicInfoOnline | MusicInfoLocal
    interface ListActionMusicMove {
      formId: string
      toId: string
      musicInfos: LX.Music.MusicInfo[]
      addMusicLocationType: LX.AddMusicLocationType
    }

    interface ListActionAdd {
      position: number
      listInfos: UserListInfo[]
    }
    type ListActionUpdate = UserListInfo[]

    interface ListActionMusicAdd {
      id: string
      musicInfos: LX.Music.MusicInfo[]
      addMusicLocationType: LX.AddMusicLocationType
    }

    interface UserListInfoFull extends UserListInfo {
      list: LX.Music.MusicInfo[]
    }

    interface ListActionUpdatePosition {
      /**
       * 列表
       * */
      ids: string[]
      /**
       * 位置
       * */
      position: number
    }
    interface ListDataFull {
      defaultList: LX.Music.MusicInfo[]
      loveList: LX.Music.MusicInfo[]
      userList: UserListInfoFull[]
      tempList: LX.Music.MusicInfo[]
    }
  }
}
