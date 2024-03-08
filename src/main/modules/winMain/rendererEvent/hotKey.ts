import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import { mainHandle } from '@common/mainIpc'
import { sendEvent } from '../main'

export default () => {
  mainHandle<LX.HotKeyConfigAll>(WIN_MAIN_RENDERER_EVENT_NAME.get_hot_key, async() => {
    return {
      local: global.lx.hotKey?.config.local,
      global: global.lx.hotKey?.config.global,
    }
  })
}

export const handleKeyDown = (type: string, key: string) => {
  sendEvent<LX.HotKeyEvent>(WIN_MAIN_RENDERER_EVENT_NAME.key_down, { type, key })
}

export const hotKeyConfigUpdate = (config: LX.HotKeyConfigAll) => {
  sendEvent<LX.HotKeyConfigAll>(WIN_MAIN_RENDERER_EVENT_NAME.set_hot_key_config, config)
}
