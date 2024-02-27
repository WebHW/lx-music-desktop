declare namespace LX {
  namespace List {
    interface UserListInfo {
      id: string
      name: string
      source: string
      sourceListId?: string
      locationUpdateTime?: number | null
    }

    interface UserListInfoFull extends UserListInfo {
      list: LX.Music.MusicInfo[]
    }
    interface ListDataFull {
      defaultList: LX.Music.MusicInfo[]
      loveList: LX.Music.MusicInfo[]
      userList: UserListInfoFull[]
      template: LX.Music.MusicInfo[]
    }
  }
}
