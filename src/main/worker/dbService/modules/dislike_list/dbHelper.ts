// import { getDB } from '../../db'
import { getDB } from '../../db'
import { createQueryStatement, createInsertStatement } from './statements'


/**
 * 查询不喜欢歌曲列表
 */
export const queryDislikeList = () => {
  const queryStatement = createQueryStatement()
  return queryStatement.all() as LX.DBService.DislikeInfo[]
}

/**
 * 批量插入不喜欢歌曲列表并刷新顺序
 * @param infos 列表
*/

export const inertDislikeList = async(infos: LX.DBService.DislikeInfo[]) => {
  const db = getDB()
  const insertStatement = createInsertStatement()
  db.transaction((infos: LX.DBService.DislikeInfo[]) => {
    for (const info of infos) insertStatement.run(info)
  })(infos)
}
