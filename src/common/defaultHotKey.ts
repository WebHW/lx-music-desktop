import { HOTKEY_PLAYER } from './hotKey'

const local: LX.HotKeyConfig = {
  enable: true,
  keys: {
    'mod+f5': {
      type: HOTKEY_PLAYER.toggle_play.type,
      name: HOTKEY_PLAYER.toggle_play.name,
      action: HOTKEY_PLAYER.toggle_play.action,
    },
  },
}
const global: LX.HotKeyConfig = {
  enable: false,
  keys: {
    'mod +alt+f5': {
      type: HOTKEY_PLAYER.toggle_play.type,
      name: HOTKEY_PLAYER.toggle_play.name,
      action: HOTKEY_PLAYER.toggle_play.action,
    },
  },
}

export default {
  local,
  global,
}

