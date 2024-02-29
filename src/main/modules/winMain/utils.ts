

import { type WindowSize, windowSizeList } from '@common/config'
export const getWindowSizeInfo = (windowSizeId: number | string): WindowSize => {
  return windowSizeList.find(i => i.id === windowSizeId) ?? windowSizeList[0]
}
