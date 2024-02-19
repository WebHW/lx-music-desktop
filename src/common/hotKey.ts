import { APP_EVENT_NAMES } from './constants'

const keyName = {
  common: APP_EVENT_NAMES.winMainName,
  player: APP_EVENT_NAMES.winMainName,
  desktop_lyric: APP_EVENT_NAMES.winLyricName,
}

const hotKey = {
  common: {
    min: {
      name: 'mini',
      action: 'min',
      type: '',
    },
  },
  player: {
    toggle_play: {
      name: 'toggle_play',
      action: 'toggle_play',
      type: '',
    },
  },
}

for (const type of Object.keys(hotKey) as Array<keyof typeof hotKey>) {
  let keys = hotKey[type]
  for (const key of Object.keys(keys) as Array<keyof typeof keys>) {
    const keyInfo: LX.HotKey = keys[key]
    keyInfo.action = `${type}_${keyInfo.action}`
    keyInfo.name = `${type}_${keyInfo.name}`
    keyInfo.type = keyName[type] as keyof typeof hotKey
  }
}

export const HOTKEY_PLAYER = hotKey.player

