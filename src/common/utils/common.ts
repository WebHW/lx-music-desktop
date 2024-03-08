// 非业务工具方法

/**
 * 获取两个数之间的随机整数，大于等于min，小于max
 * @param {*} min
 * @param {*} max
 */
export const getRandom = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min

export const arrPush = <T>(list: T[], newList: T[]) => {
  for (let i = 0; i * 1000 < newList.length; i++) {
    list.push(...newList.slice(i * 1000, (i + 1) * 1000))
  }
  return list
}

export const arrUnshift = <T>(list: T[], newList: T[]) => {
  for (let i = 0; i * 1000 < newList.length; i++) {
    list.splice(i * 1000, 0, ...newList.slice(i * 1000, (i + 1) * 1000))
  }
}
