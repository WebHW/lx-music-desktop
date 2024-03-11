import { LIST_IDS } from '@common/constants'
import { arrPush, arrUnshift } from '@common/utils/common'
import {
  deleteUserLists,
  overwriteListData,
  queryMusicInfoByListId,
  queryAllUserList, inertUserLists,
  updateUserLists as updateUserListsFromDB,
  insertMusicInfoListAndRefreshOrder,
  removeMusicInfos,
} from './dbHelper'
let musicLists = new Map<string, LX.Music.MusicInfo[]>()

let userLists: LX.DBService.UserListInfo[]

/**
 * 批量更新列表位置
 * @param position 列表位置
 * @param ids 列表ids
 */
export const updateUserListsPosition = (position: number, ids: string[]) => {
  userLists ??= queryAllUserList()
  const newUserLists = [...userLists]
  const updateLists: LX.DBService.UserListInfo[] = []

  for (let i = newUserLists.length - 1; i >= 0; i--) {
    if (ids.includes(newUserLists[i].id)) {
      const list = newUserLists.splice(i, 1)[0]
      list.locationUpdateTime = Date.now()
      updateLists.push(list)
    }
  }
  position = Math.min(newUserLists.length, position)

  newUserLists.splice(position, 0, ...updateLists)
  newUserLists.forEach((list, index) => {
    list.position = index
  })
  inertUserLists(newUserLists, true)
  userLists = newUserLists
}

/**
 * 批量创建列表
 * @param position 列表位置
 * @param lists 列表信息
 */

export const createUserLists = (position: number, lists: LX.List.UserListInfo[]) => {
  userLists ??= queryAllUserList()
  if (position < 0 || position > userLists.length) {
    const newLists: LX.DBService.UserListInfo[] = lists.map((list, index) => {
      return {
        ...list,
        position: position + index,
      }
    })
    inertUserLists(newLists)
    userLists = [...userLists, ...newLists]
  } else {
    const newUserLists = [...userLists]
    // @ts-expect-error
    newUserLists.splice(position, 0, ...lists)
    newUserLists.forEach((list, index) => {
      list.position = index
    })
    inertUserLists(newUserLists, true)
    userLists = newUserLists
  }
}
/**
 * 获取所有用户列表
 * @returns
 */
export const getAllUserList = (): LX.List.UserListInfo[] => {
  userLists ??= queryAllUserList()
  return userLists.map(list => {
    const { position, ...newList } = list
    return newList
  })
}

/**
 * 批量删除列表
 * @param ids 列表ids
 */

export const removeUserLists = (ids: string[]) => {
  deleteUserLists(ids)
  userLists = queryAllUserList()
}
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


/**
 * 批量删除歌曲
 * @param listId 列表Id
 * @param ids 要删除歌曲的id
 */
export const musicsRemove = (listId: string, ids: string[]) => {
  let targetList = getListMusics(listId)
  if (!targetList.length) return
  removeMusicInfos(listId, ids)
  const idsSet = new Set(ids)
  musicLists.set(listId, targetList.filter(info => !idsSet.has(info.id)))
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

/**
 * 批量更新列表信息
 * @param lists 列表信息
*/
export const updateUserLists = (lists: LX.List.UserListInfo[]) => {
  const positionMap = new Map<string, number>()
  for (const list of userLists) {
    positionMap.set(list.id, list.position)
  }
  const dbLists: LX.DBService.UserListInfo[] = lists.map(list => {
    const position = positionMap.get(list.id)
    if (position == null) return null
    return { ...list, position }
  }).filter(Boolean) as LX.DBService.UserListInfo[]
  updateUserListsFromDB(dbLists)
  userLists &&= queryAllUserList()
}

/**
 * 批量添加歌曲
 * @param listId 列表id
 * @param musicInfos 添加歌曲信息
 * @param addMusicLocationType 添加在到列表的位置
*/

export const musicsAdd = (listId: string, musicInfos: LX.Music.MusicInfo[], addMusicLocationType: LX.AddMusicLocationType) => {
  let targetList = getListMusics(listId)

  const set = new Set<string>()
  for (const item of targetList) {
    set.add(item.id)
  }
  musicInfos = musicInfos.filter(item => {
    if (set.has(item.id)) return false
    set.add(item.id)
    return true
  })

  switch (addMusicLocationType) {
    case 'top':
      insertMusicInfoListAndRefreshOrder(toDBMusicInfo(musicInfos, listId), listId, toDBMusicInfo(targetList, listId, musicInfos.length))
      arrUnshift(targetList, musicInfos)
      break
    case 'bottom':
    default:
      insertMusicInfoList(toDBMusicInfo(musicInfos, listId, targetList.length))
      arrPush(targetList, musicInfos)
      break
  }
}
