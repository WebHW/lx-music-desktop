import { EventEmitter } from 'events'

export class Event extends EventEmitter {
  list_change() {
    this.emit('list_change')
  }
}

type EventMethods = Omit<EventType, keyof EventEmitter>
declare class EventType extends EventEmitter {
  on<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  once<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  off<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
}

export type Type = Omit<EventType, keyof Omit<EventEmitter, 'on' | 'off' | 'once'>>
