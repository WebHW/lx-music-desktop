import { EventEmitter } from 'events'
import { saveAppHotKeyConfig, updateSetting } from '@main/utils'

export class Event extends EventEmitter {
  // closeAll() {
  //   this.emit(COMMON_EVENT_NAME.closeAll)
  // }
  // initSetting() {
  //   this.emit(COMMON_EVENT_NAME.initConfig)
  //   // this.configStatus(null)
  // }

  /**
   * 初始化APP
   */
  app_inited() {
    this.emit('app_inited')
  }

  theme_change() {
    this.emit('theme_change')
  }

  system_theme_change(isDark: boolean) {
    this.emit('system_theme_change', isDark)
  }

  main_window_inited() {
    this.emit('main_window_inited')
  }


  main_window_fullscreen(isFullscreen: boolean) {
    this.emit('main_window_fullscreen', isFullscreen)
  }

  main_window_ready_to_show() {
    this.emit('main_window_ready_to_show')
  }

  main_window_show() {
    this.emit('main_window_show')
  }

  hot_key_down(keyInfo: LX.HotKeyDownInfo) {
    this.emit('hot_key_down', keyInfo)
  }

  hot_key_config_update(config: LX.HotKeyConfigAll) {
    saveAppHotKeyConfig(config)
    this.emit('hot_key_config_update', config)
  }

  updated_config(keys: Array<keyof LX.AppSetting>, setting: Partial<LX.AppSetting>) {
    this.emit('updated_config', keys, setting)
  }

  /**
   * 更新配置
   *  @param setting 新设置
  */
  update_config(setting: Partial<LX.AppSetting>) {
    const { setting: newSetting, updatedSettingKeys, updatedSetting } = updateSetting(setting)
    global.lx.appSetting = newSetting
    if (!updatedSettingKeys.length) return
    this.emit('updated_config', newSetting)
    this.updated_config(updatedSettingKeys, updatedSetting)
  }

  deeplink(link: string) {
    this.emit('deeplink', link)
  }


  main_window_hide() {
    this.emit('main_window_hide')
  }

  main_window_close() {
    this.emit('main_window_close')
  }

  main_window_focus() {
    this.emit('main_window_focus')
  }

  main_window_blur() {
    this.emit('main_window_blur')
  }
}


type EventMethods = Omit<EventType, keyof EventEmitter>
declare class EventType extends Event {
  on<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  once<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  off<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
}

export type Type = Omit<EventType, keyof Omit<EventEmitter, 'on' | 'off' | 'once'>>
