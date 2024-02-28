import { init } from './db'

import { type list, type lyric } from './modules/index'

const common = {
  init,
}
export type workerDBSeriveTypes = typeof common
& typeof list
& typeof lyric
