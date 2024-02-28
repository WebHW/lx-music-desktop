import { LIST_IDS } from '@common/constants'
import { arrPush } from '@common/utils/common'
import { overwriteListData, queryMusicInfoByListId } from './dbHelper'
let musicLists = new Map<string, LX.Music.MusicInfo[]>()

let userLists: LX.DBService.UserListInfo[]
/**
 * 根据列表ID获取列表内歌曲
 * @param listId 列表ID
 * @returns 列表内歌曲
 */
export const getListMusics = (listId: string): LX.Music.MusicInfo[] => {
  let targetList: LX.Music.MusicInfo[] | undefined = musicLists.get(listId)
  if (targetList == null) {
    targetList = queryMusicInfoByListId(listId).map(info => {
      return {
        id: info.id,
        name: info.name,
        singer: info.singer,
        source: info.source,
        interval: info.interval,
        meta: JSON.parse(info.meta),
      }
    })
    musicLists.set(listId, targetList)
  }
  return targetList
}

const toDBMusicInfo = (musicInfos: LX.Music.MusicInfo[], listId: string, offset: number = 0): LX.DBService.MusicInfo[] => {
  return musicInfos.map((info, index) => {
    return {
      ...info,
      listId,
      meta: JSON.stringify(info.meta),
      order: offset + index,
    }
  })
}

/**
 * 覆盖所有列表数据
 * @param myListData 完整列表数据
 */
export const listDataOverwrite = (myListData: MakeOptional<LX.List.ListDataFull, 'tempList'>) => {
  const dbLists: LX.DBService.UserListInfo[] = []
  const listData: LX.List.ListDataFull = {
    ...myListData,
    tempList: myListData.tempList ?? getListMusics(LIST_IDS.TEMP),
  }

  const dbMusicInfos: LX.DBService.MusicInfo[] = [
    ...toDBMusicInfo(listData.defaultList, LIST_IDS.DEFAULT),
    ...toDBMusicInfo(listData.loveList, LIST_IDS.LOVE),
    ...toDBMusicInfo(listData.tempList, LIST_IDS.TEMP),
  ]
  listData.userList.forEach(({ list, ...listInfo }, index) => {
    dbLists.push({ ...listInfo, position: index })
    arrPush(dbMusicInfos, toDBMusicInfo(list, listInfo.id))
  })
  overwriteListData(dbLists, dbMusicInfos)

  if (userLists) userLists.splice(0, userLists.length, ...dbLists)
  else userLists = dbLists

  musicLists.clear()
  musicLists.set(LIST_IDS.DEFAULT, listData.defaultList)
  musicLists.set(LIST_IDS.LOVE, listData.loveList)
  musicLists.set(LIST_IDS.TEMP, listData.tempList)
  for (const list of listData.userList) musicLists.set(list.id, list.list)
}
