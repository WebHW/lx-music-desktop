import { EventEmitter } from 'events'

// import { saveAppHotKeyConfig, updateSetting } from '@main/utils'
// function updateSetting(setting: any) {
//   return {
//     setting, updatedSettingKeys: [], updatedSetting: {},
//   }
// }
// function saveAppHotKeyConfig(config: any) { console.log(config) }

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

  deeplink() {
    this.emit('deeplink')
  }


  main_window_close() {
    this.emit('main_window_close')
  }

  main_window_focus() {
    this.emit('main_window_focus')
  }
}


type EventMethods = Omit<EventType, keyof EventEmitter>
declare class EventType extends Event {
  on<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  once<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  off<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
}

export type Type = Omit<EventType, keyof Omit<EventEmitter, 'on' | 'off' | 'once'>>
