import { getDB } from '../../db'

/**
 * 创建音乐信息排序插入语句
 * @returns 插入语句
 */
export const createMusicInfoOrderInsertStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.MusicInfoOrder]>(`
    INSERT INTO "main"."my_list_music_info_order" ("listId", "musicInfoId", "order")
    VALUES (@listId, @musicInfoId, @order)`)
}

/**
 * 创建音乐信息插入语句
 * @returns 插入语句
 * */
export const createMusicInfoInsertStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.MusicInfo]>(`
    INSERT INTO "main"."my_list_music_info" ("id","listId","name","singer","source","interval","meta")
    VALUES (@id,@listId,@name,@singer,@source,@interval,@meta)
  `)
}
/**
 * 创建清空音乐排序语句
 * @returns 删除语句
 */
export const createMusicInfoOrderClearStatement = () => {
  const db = getDB()
  return db.prepare<[]>('DELETE FROM "main"."my_list_music_info_order"')
}

/**
 * 创建清空音乐信息语句
 * @returns 删除语句
 */
export const createMusicInfoClearStatement = () => {
  const db = getDB()
  return db.prepare<[]>('DELETE FROM "main"."my_list_music_info"')
}
/**
 * 创建列表清空语句
 * @returns 清空语句
*/
export const createListClearStatement = () => {
  const db = getDB()
  return db.prepare<[]>('DELETE FROM "main"."my_list"')
}

/**
 * 创建列表插入语句
 * @returns 插入语句
 */

export const createListInsertStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.UserListInfo]>(`
    INSERT INTO "main"."my_list" ("id","name","source","sourceListId","position", "locationUpdateTime")
    VALUES (@id,@name,@source,@sourceListId,@position,@locationUpdateTime)
  `)
}

/**
 * 创建音乐信息查询语句
 * @returns 查询语句
 */
export const createMusicInfoQueryStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.MusicInfoQuery]>(`
    SELECT mInfo."id",mInfo."name",mInfo."singer",mInfo."source",mInfo."interval",mInfo."meta" 
    FROM my_list_music_info mInfo
    LEFT JOIN my_list_music_info_order 0
    ON mInfo.id=0.musicInfoId AND 0.listId=@listId
    ORDER BY 0."order" ASC
  `)
}


/**
 * 创建列表删除语句
 * @returns 删除语句
*/
export const createListDeleteStatement = () => {
  const db = getDB()
  return db.prepare<[string]>('DELETE FROM "main"."my_list" WHERE "id"=?')
}

/**
 * 创建根据列表id批量伤处音乐信息语句
 * @returns 删除语句
*/
export const createMusicInfoDeleteByListIdStatement = () => {
  const db = getDB()
  return db.prepare<[string]>('DELETE FROM "main"."my_list_music_info" WHERE "listId"=?')
}

/**
 * 创建根据列表id删除音乐排序语句
 * @returns 删除语句
*/
export const createMusicInfoOrderDeleteByListIdStatement = () => {
  const db = getDB()
  return db.prepare<[string]>('DELETE FROM "main"."my_list_music_info_order" WHERE "listId"=?')
}


/**
 * 创建列表更新语句
 * @returns 更新语句
*/
export const createListUpdateStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.UserListInfo]>(`
  UPDATE "main"."my_list" 
  SET "name"=@name, "source"=@source, "sourceListId"=@sourceListId,"locationUpdateTime"=@locationUpdateTime
  WHERE "id"=@id`,
  )
}
