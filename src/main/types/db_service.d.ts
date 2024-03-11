declare namespace LX{
  namespace DBService{
    interface MusicInfoOrder {
      listId: string
      musicInfoId: string
      order: number
    }
    interface MusicInfo {
      id: string
      listId: string
      name: string
      singer: string
      interval: string | null
      source: LX.MusicInfo['source']
      meta: string
      order: number
    }

    interface MusicInfoRemove {
      listId: string
      id: string
    }
    interface UserListInfo {
      id: string
      name: string
      source?: LX.OnlineSource
      sourceListId?: string
      position: number
      locationUpdateTime: number | null
    }

    type Lyricnfo = {
      id: string
      type: 'lyric'
      text: string
      source: 'raw' | 'edited'
    } | {
      id: string
      type: keyof Omit<LX.Music.LyricInfo, 'lyric'>
      text: string | null
      source: 'raw' | 'edited'
    }

    interface MusicInfoQuery {
      listId: string
    }

    interface UserListInfo {
      id: string
      name: string
      source?: LX.OnlineSource
      sourceListId?: string
      position: number
      locationUpdateTime: number | null
    }
  }
}
