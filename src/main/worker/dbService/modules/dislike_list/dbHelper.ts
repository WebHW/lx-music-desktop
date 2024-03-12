// import { getDB } from '../../db'
import { createQueryStatement } from './statements'


/**
 * 查询不喜欢歌曲列表
 */
export const queryDislikeList = () => {
  const queryStatement = createQueryStatement()
  return queryStatement.all() as LX.DBService.DislikeInfo[]
}
