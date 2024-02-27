import fs from 'node:fs'
import path from 'node:path'

export const joinPath = (...paths: string[]): string => path.join(...paths)
/**
 * 检查路径是否存在
 * @param {*} path 路径
 */
export const checkPath = async(path: string): Promise<boolean> => {
  return new Promise(resolve => {
    if (!path) {
      resolve(false)
      return
    }
    fs.access(path, fs.constants.F_OK, err => {
      if (err) {
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}
