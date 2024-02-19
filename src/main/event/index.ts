import { Event as App, type Type as AppType } from './AppEvent'

export type {
  AppType,
}

export const createAppEvent = (): AppType => {
  return new App()
}
