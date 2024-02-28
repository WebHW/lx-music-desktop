import { getDB } from '../../db'
import {
  createEditedLyricInsertStatement,
} from './statements'

/**
 * 批量插入已编辑歌词
 * @pramas lyrics 列表
*/

export const inertEditedLyric = (lyrics: LX.DBService.Lyricnfo[]) => {
  const db = getDB()
  const rawLyricInsertStatement = createEditedLyricInsertStatement()
  db.transaction((lyrics: LX.DBService.Lyricnfo[]) => {
    for (const lyric of lyrics) rawLyricInsertStatement.run(lyric)
  })(lyrics)
}
