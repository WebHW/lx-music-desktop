import { EventEmitter } from 'events'

export class Event extends EventEmitter {
  dislike_change() {
    this.emit('dislike_change')
  }
}

type EventMethods = Omit<EventType, keyof EventEmitter>

declare class EventType extends Event {
  on<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  once<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
  off<K extends keyof EventMethods>(event: K, listener: EventMethods[K]): this
}

export type Type = Omit<EventType, keyof Omit<EventEmitter, 'on' | 'off' | 'once'>>
