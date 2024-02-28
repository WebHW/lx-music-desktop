declare namespace LX {
  namespace List {
    interface UserListInfo {
      id: string
      name: string
      // list: LX.Music.MusicInfo[]
      source?: LX.OnlineSource
      sourceListId?: string
      // position?: number
      locationUpdateTime: number | null
    }


    interface UserListInfoFull extends UserListInfo {
      list: LX.Music.MusicInfo[]
    }
    interface ListDataFull {
      defaultList: LX.Music.MusicInfo[]
      loveList: LX.Music.MusicInfo[]
      userList: UserListInfoFull[]
      tempList: LX.Music.MusicInfo[]
    }
  }
}
