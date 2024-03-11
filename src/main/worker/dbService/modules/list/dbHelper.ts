import { getDB } from '../../db'
import {
  createListClearStatement,
  createListInsertStatement,
  createMusicInfoClearStatement,
  createMusicInfoInsertStatement,
  createMusicInfoQueryStatement,
  createMusicInfoOrderClearStatement,
  createMusicInfoOrderInsertStatement,
  createMusicInfoOrderDeleteStatement,
  createMusicInfoUpdateStatement,
  createListDeleteStatement,
  createMusicInfoDeleteByListIdStatement,
  createMusicInfoOrderDeleteByListIdStatement,
  createListUpdateStatement,
  createMusicInfoDeleteStatement,
} from './statements'


const idFixRxp = /\.0$/
/**
 * 批量更新歌曲位置
 * @param listId 列表id
 * @param musicInfoOrders 音乐顺序
*/

export const updateMusicInfoOrder = (listId: string, musicInfoOrders: LX.DBService.MusicInfoOrder[]) => {
  const db = getDB()
  const musicInfoOrderInsertStatement = createMusicInfoOrderInsertStatement()
  const musicInfoOrderDeleteByListIdStatement = createMusicInfoOrderDeleteByListIdStatement()
  db.transaction((listId: string, musicInfoOrders: LX.DBService.MusicInfoOrder[]) => {
    musicInfoOrderDeleteByListIdStatement.run(listId)
    for (const orderInfo of musicInfoOrders) musicInfoOrderInsertStatement.run(orderInfo)
  })(listId, musicInfoOrders)
}

/**
 * 批量更新歌曲
 * @param list
 */
export const updateMusicInfos = (list: LX.DBService.MusicInfo[]) => {
  const musicInfoUpdateStatement = createMusicInfoUpdateStatement()
  const db = getDB()
  db.transaction((musics: LX.DBService.MusicInfo[]) => {
    for (const music of musics) {
      musicInfoUpdateStatement.run(music)
    }
  })(list)
}

/**
 * 批量添加歌曲并刷新排序
 * @param list 新增歌曲
 * @param listId 列表Id
 * @param listAll 原始列表歌曲，列表去重后
 */

export const insertMusicInfoListAndRefreshOrder = (list: LX.DBService.MusicInfo[], listId: string, listAll: LX.DBService.MusicInfo[]) => {
  const musicInfoInsertStatement = createMusicInfoInsertStatement()
  const musicInfoOrderInsertStatement = createMusicInfoOrderInsertStatement()
  const musicInfoOrderDeleteByListIdStatement = createMusicInfoOrderDeleteByListIdStatement()

  const db = getDB()
  db.transaction((list: LX.DBService.MusicInfo[], listId: string, listAll: LX.DBService.MusicInfo[]) => {
    musicInfoOrderDeleteByListIdStatement.run(listId)
    for (const music of list) {
      musicInfoInsertStatement.run(music)
      musicInfoOrderInsertStatement.run({
        listId: music.listId,
        musicInfoId: music.id,
        order: music.order,
      })
    }

    for (const music of listAll) {
      musicInfoOrderInsertStatement.run({
        listId: music.listId,
        musicInfoId: music.id,
        order: music.order,
      })
    }
  })(list, listId, listAll)
}

/**
 * 批量移除列表内容
 * @param listId 列表Id
 * @param ids 音乐id
*/
export const removeMusicInfos = (listId: string, ids: string[]) => {
  const musicInfoDeleteStatement = createMusicInfoDeleteStatement()
  const musicInfoOrderDeleteStatement = createMusicInfoOrderDeleteStatement()
  const db = getDB()
  db.transaction((listId: string, ids: string[]) => {
    for (const id of ids) {
      musicInfoDeleteStatement.run({ listId, id })
      musicInfoOrderDeleteStatement.run({ listId, id })
    }
  })(listId, ids)
}

/**
 * 批量插入用户列表
 * @param lists 列表
 * @param isClear 是否清空列表
 */
export const inertUserLists = (lists: LX.DBService.UserListInfo[], isClear: boolean = false) => {
  const db = getDB()
  const listClearStatement = createListClearStatement()
  const listInsertStatement = createListInsertStatement()
  db.transaction((lists: LX.DBService.UserListInfo[]) => {
    if (isClear) listClearStatement.run()
    for (const list of lists) {
      listInsertStatement.run({
        id: list.id,
        name: list.name,
        source: list.source,
        sourceListId: list.sourceListId,
        locationUpdateTime: list.locationUpdateTime,
        position: list.position,
      })
    }
  })(lists)
}


/**
 * 获取用户列表
 * @returns
 */
export const queryAllUserList = () => {
  const list = createListClearStatement().all() as LX.DBService.UserListInfo[]
  for (const info of list) {
    // 兼容v2.3.0之前版本插入数字类型的ID导致其意外在末尾追加 .0 的问题
    if (info.sourceListId?.endsWith?.('.0')) {
      info.sourceListId = info.sourceListId.replace(idFixRxp, '')
    }
  }
  return list
}

/**
 * 覆盖整个列表
 * @param lists 列表
 * @param musicInfos 歌曲列表
 */
export const overwriteListData = (lists: LX.DBService.UserListInfo[], musicInfos: LX.DBService.MusicInfo[]) => {
  const db = getDB()
  const listClearStatement = createListClearStatement()
  const listInsertStatement = createListInsertStatement()
  const musicInfoClearStatement = createMusicInfoClearStatement()
  const musicInfoInsertStatement = createMusicInfoInsertStatement()
  const musicInfoOrderClearStatement = createMusicInfoOrderClearStatement()
  const musicInfoOrderInsertStatement = createMusicInfoOrderInsertStatement()

  db.transaction((lists: LX.DBService.UserListInfo[], musicInfos: LX.DBService.MusicInfo[]) => {
    listClearStatement.run()
    for (const list of lists) {
      listInsertStatement.run({
        id: list.id,
        name: list.name,
        source: list.source,
        sourceListId: list.sourceListId,
        locationUpdateTime: list.locationUpdateTime,
        position: list.position,
      })
    }

    musicInfoClearStatement.run()
    musicInfoOrderClearStatement.run()
    for (const musicInfo of musicInfos) {
      musicInfoInsertStatement.run(musicInfo)
      musicInfoOrderInsertStatement.run({
        listId: musicInfo.listId,
        musicInfoId: musicInfo.id,
        order: musicInfo.order,
      })
    }
  })(lists, musicInfos)
}
/**
 * 获取列表内的歌曲
 * @param listId 列表Id
 * @returns 列表歌曲
 */

export const queryMusicInfoByListId = (listId: string) => {
  const MusicInfoQueryStatement = createMusicInfoQueryStatement()
  return MusicInfoQueryStatement.all({ listId }) as LX.DBService.MusicInfo[]
}


/**
 * 批量删除用户列表及列表内歌曲
 * @param listIds 列表id
*/
export const deleteUserLists = (listIds: string[]) => {
  const db = getDB()
  const listDeleteStatement = createListDeleteStatement()
  const musicInfoDeleteByListIdStatement = createMusicInfoDeleteByListIdStatement()
  const musicInfoOrderDeleteByListIdStatement = createMusicInfoOrderDeleteByListIdStatement()
  db.transaction((lists: string[]) => {
    for (const id of listIds) {
      listDeleteStatement.run(id)
      musicInfoDeleteByListIdStatement.run(id)
      musicInfoOrderDeleteByListIdStatement.run(id)
    }
  })
}

/**
 * 批量更新用户列表
 * @param lists 列表
*/
export const updateUserLists = (lists: LX.DBService.UserListInfo[]) => {
  const db = getDB()
  const listUpdateStatement = createListUpdateStatement()
  db.transaction((lists: LX.DBService.UserListInfo[]) => {
    for (const list of lists) {
      listUpdateStatement.run(list)
    }
  })(lists)
}
