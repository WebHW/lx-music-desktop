import { getDB } from '../../db'

/**
 * 创建不喜欢列表查询语句
 * @returns 查询语句
*/

export const createQueryStatement = () => {
  const db = getDB()
  return db.prepare<[]>(`
    SELECT 'content' 
    FROM dislike_list
    WHERE "type"='music'
  `)
}

/**
 * 创建不喜欢记录插入语句
 * @returns 插入语句
*/
export const createInsertStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.DislikeInfo]>(`
  INSERT INTO "main"."dislike_list" ("type", "content") 
  VALUES ('music', @content)`)
}
