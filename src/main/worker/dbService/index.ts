import { init } from './db'

import { type list, type lyric, type dislike_list } from './modules/index'

const common = {
  init,
}
export type workerDBSeriveTypes = typeof common
& typeof list
& typeof lyric
& typeof dislike_list
