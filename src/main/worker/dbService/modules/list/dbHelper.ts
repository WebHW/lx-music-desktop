import { getDB } from '../../db'
import {
  createListClearStatement,
  createListInsertStatement,
  createMusicInfoClearStatement,
  createMusicInfoInsertStatement,
  createMusicInfoQueryStatement,
  createMusicInfoOrderClearStatement,
  createMusicInfoOrderInsertStatement,
} from './statements'
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
