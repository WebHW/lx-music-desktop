import { getDB } from '../../db'

const EDITED_LYRIC = 'edited'
/**
 * 创建已编辑歌词插入语句
 * @returns 插入语句
 */
export const createEditedLyricInsertStatement = () => {
  const db = getDB()
  return db.prepare<[LX.DBService.Lyricnfo]>(`
  INSERT INTO "main"."lyric" ("id", "type", "text", "source")
  VALUES (@id, @type, @text, '${EDITED_LYRIC}')
  `)
}
