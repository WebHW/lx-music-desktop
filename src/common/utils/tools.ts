// 业务工具方法
export const toNewMusicInfo = (oldMusicInfo: any): LX.Music.MusicInfo => {
  const meta: Record<string, any> = {
    songId: oldMusicInfo.songmid,
    albumName: oldMusicInfo.albumname,
    picUrl: oldMusicInfo.img,
  }
  if (oldMusicInfo.source == 'local') {
    meta.filePath = oldMusicInfo.filepath ?? oldMusicInfo.songmid ?? ''
    meta.ext = oldMusicInfo.ext ?? /\.(\w+)$/.exec(meta.filePath)?.[1] ?? ''
  } else {
    meta.qualitys = oldMusicInfo.types
    meta._quality = oldMusicInfo._type
    meta.albumId = oldMusicInfo.albumId
    if (meta._quality.flac32bit && !meta._quality.flac24bit) {
      meta._quality.flac24bit = meta._quality.flac32bit
      delete meta._quality.flac32bit

      meta.qualitys = (meta.qualitys as any[]).map(quality => {
        if (quality.type == 'flac32bit') {
          quality.type = 'flac24bit'
          return quality
        }
      })
    }

    switch (oldMusicInfo.source) {
      case 'kg':
        meta.hash = oldMusicInfo.hash
      case 'tx':
        meta.strMediaMid = oldMusicInfo.strMediaMid
        meta.id = oldMusicInfo.songId
        meta.albumMid = oldMusicInfo.albumMid
      case 'mg':
        meta.copyrightId = oldMusicInfo.copyrightId
        meta.lrcUrl = oldMusicInfo.lrcUrl
        meta.mrcUrl = oldMusicInfo.mrcUrl
        meta.trcUrl = oldMusicInfo.trcUrl
        break
    }
  }

  return {
    id: `${oldMusicInfo.source as string}_${oldMusicInfo.songmid as string}`,
    name: oldMusicInfo.name,
    singer: oldMusicInfo.singer,
    source: oldMusicInfo.source,
    interval: oldMusicInfo.interval,
    meta: meta as LX.Music.MusicInfoOnline['meta'],
  }
}

export const filterMusicList = <T extends LX.Music.MusicInfo>(list: T[]): T[] => {
  const ids = new Set<string>()
  return list.filter(s => {
    if (!s.id || ids.has(s.id) || !s.name) return false
    if (s.singer == null) s.singer = ''
    ids.add(s.id)
    return true
  })
}


