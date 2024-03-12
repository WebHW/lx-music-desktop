import { SPLIT_CHAR } from '@common/constants'
import { queryDislikeList } from './dbHelper'

const toDBDislikeInfo = (musicInfos: string[]): LX.DBService.DislikeInfo[] => {
  const list: LX.DBService.DislikeInfo[] = []
  for (const item of musicInfos) {
    if (!item.trim()) continue
    list.push({
      content: item,
    })
  }
  return list
}

const initDislikeList = () => {
  const dislikeInfo: LX.Dislike.DislikeInfo = {
    names: new Set<string>(),
    singerNames: new Set<string>(),
    musicNames: new Set<string>(),
    rules: '',
  }
  const list = []
  for (const item of queryDislikeList()) {
    if (!item) continue
    let [name, singer] = item.content.split(SPLIT_CHAR.DISLIKE_NAME)
    if (name) {
      name = name.replaceAll(SPLIT_CHAR.DISLIKE_NAME, SPLIT_CHAR.DISLIKE_NAME_ALIAS)
      if (singer) {
        singer = singer.replaceAll(SPLIT_CHAR.DISLIKE_NAME, SPLIT_CHAR.DISLIKE_NAME_ALIAS).toLocalLowerCase().trim()
        const rule = `${name}${SPLIT_CHAR.DISLIKE_NAME}${singer}`
        dislikeInfo.names.add(rule)
        list.push(rule)
      } else {
        dislikeInfo.musicNames.add(name)
        list.push(name)
      }
    } else if (singer) {
      singer = singer.replaceAll(SPLIT_CHAR.DISLIKE_NAME, SPLIT_CHAR.DISLIKE_NAME_ALIAS).toLocaleLowerCase().trim()
      dislikeInfo.singerNames.add(singer)
      list.push(`${SPLIT_CHAR.DISLIKE_NAME}${singer}`)
    }
  }
  dislikeInfo.rules = Array.from(new Set(list)).join('\n')
  return dislikeInfo
}

/**
 * 获取不喜欢列表信息
 * @returns 不喜欢列表信息
 */
export const getDislikeListInfo = (): LX.Dislike.DislikeInfo => {
  // if (!dislikeInfo) initDislikeList()
  return initDislikeList()
}

