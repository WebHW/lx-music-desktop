import { shell } from 'electron'

/**
 * 在资源管理器中打开目录
 * @param {string} dir
 */
export const openDirInExplorer = (dir: string) => {
  shell.showItemInFolder(dir)
}

export const encodePath = (path: string) => {
  return path.replaceAll('%', '%25').replaceAll('#', '%23')
}
