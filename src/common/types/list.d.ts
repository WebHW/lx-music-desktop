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
