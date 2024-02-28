import {
  inertEditedLyric,
} from './dbHelper'


const keys = ['lyric', 'tlyric', 'rlyric', 'lxlyric'] as const

const toDBLyric = (id: string, source: LX.DBService.Lyricnfo['source'], lyricInfo: LX.Music.LyricInfo): LX.DBService.Lyricnfo[] => {
  return (keys.map(k => [k, lyricInfo[k]])
    .filter(([k, t]) => t != null) as Array<[LX.DBService.Lyricnfo['type'], string]>)
    .map(([k, t]) => {
      return {
        id,
        type: k,
        text: Buffer.from(t).toString('base64'),
        source,
      }
    })
}

/**
 * 保存已编辑歌词信息
 * @param id 歌曲id
 * @param lyricInfo 歌词信息
 */
export const editedLyricAdd = (id:string,lyricInfo:LX.Music.LyricInfo)=>{
  inertEditedLyric(toDBLyric(id:'edited',lyricInfo))
}