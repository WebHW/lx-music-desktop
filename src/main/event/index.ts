import { Event as App, type Type as AppType } from './AppEvent'
import { Event as Dislike, type Type as DislikeType } from './DislikeEvent'
import { Event as List, type Type as ListType } from './ListEvent'

export type {
  AppType,
  ListType,
  DislikeType,
}

export const createAppEvent = (): AppType => {
  return new App()
}

export const createDislikeEvent = (): DislikeType => {
  return new Dislike()
}

export const createListEvent = (): ListType => {
  return new List()
}
