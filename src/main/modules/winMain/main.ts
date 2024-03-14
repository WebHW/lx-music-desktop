import { BrowserWindow, dialog, session } from 'electron'
import { isLinux, isWin } from '@common/utils'
import { getWindowSizeInfo, createTaskBarButtons } from './utils'
import { openDevTools as handleOpenDevTools } from '@main/utils'
import path from 'node:path'
import { sendFocus, sendTaskbarButtonClick } from './rendererEvent'
import { mainSend } from '@common/mainIpc'
import { encodePath } from '@common/utils/electron'


let browserWindow: Electron.BrowserWindow | null = null
const winEvent = () => {
  if (!browserWindow) return
  browserWindow.on('close', (event) => {
    if (global.lx.isSkipTrayQuit || !global.lx.appSetting['tray.enable'] || (!isWin && !global.lx.isTrafficLightClose)) {
      browserWindow!.setProgressBar(-1)
      global.lx.event_app.main_window_close()
      event.preventDefault()
    }

    global.lx.isTrafficLightClose &&= false
    event.preventDefault()
    browserWindow!.hide()
  })

  browserWindow.on('closed', () => {
    browserWindow = null
  })

  browserWindow.on('focus', () => {
    sendFocus()
    global.lx.event_app.main_window_focus()
  })
}

export const createWindow = () => {
  closeWindow()

  const windowSizeInfo = getWindowSizeInfo(global.lx.appSetting['common.windowSizeId'])
  const { shouldUseDarkColors, theme } = global.lx.theme
  const ses = session.fromPartition('persist:win-main')

  /**
   * Initial window options
   */

  const options: Electron.BrowserWindowConstructorOptions = {
    height: windowSizeInfo.height,
    useContentSize: true,
    width: windowSizeInfo.width,
    frame: false,
    transparent: !global.envParams.cmdParams.dt,
    resizable: false,
    maximizable: false,
    fullscreen: true,
    show: false,
    webPreferences: {
      session: ses,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webSecurity: false,
      nodeIntegration: true,
      sandbox: false,
      enableWebSQL: false,
      webgl: false,
      spellcheck: false, // 禁用拼写检查器
    },
  }
  if (global.envParams.cmdParams.dt) options.backgroundColor = theme.colors['--color-primary-light-1000']
  if (global.lx.appSetting['common.startInFullscreen']) {
    options.fullscreen = true
    if (isLinux) options.resizable = true
  }
  browserWindow = new BrowserWindow(options)

  const winURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:9080' : `file://${path.join(encodePath(__dirname), 'index.html')}`
  void browserWindow.loadURL(winURL + `?dt=${!!global.envParams.cmdParams.dt}&dark=${shouldUseDarkColors}&theme=${encodeURIComponent(JSON.stringify(theme))}`)
  winEvent()
  if (global.envParams.cmdParams.odt) handleOpenDevTools(browserWindow.webContents)
}

export const sendEvent = <T=any>(name: string, params?: T) => {
  if (!browserWindow) return
  mainSend(browserWindow, name, params)
}

export const closeWindow = () => {
  if (!browserWindow) return
  browserWindow.close()
}

export const hideWindow = () => {
  if (!browserWindow) return
  browserWindow.hide()
}

export const minimize = () => {
  if (!browserWindow) return
  browserWindow.minimize()
}
export const maximize = () => {
  if (!browserWindow) return
  browserWindow.maximize()
}
export const unmaximize = () => {
  if (!browserWindow) return
  browserWindow.unmaximize()
}
export const toggleHide = () => {
  if (!browserWindow) return
  browserWindow.isVisible()
    ? browserWindow.hide()
    : browserWindow.show()
}
export const toggleMinimize = () => {
  if (!browserWindow) return
  if (browserWindow.isMinimized()) {
    if (!browserWindow.isVisible()) {
      browserWindow.show()
    }
    browserWindow.restore()
    browserWindow.focus()
  } else {
    browserWindow.minimize()
  }
}
export const showWindow = () => {
  if (!browserWindow) return
  if (browserWindow.isMinimized()) {
    browserWindow.restore()
  }
  if (browserWindow.isVisible()) {
    browserWindow.focus()
  } else {
    browserWindow.show()
  }
}

export const isExistWindow = (): boolean => !!browserWindow
export const isShowWindow = (): boolean => {
  if (!browserWindow) return false
  return browserWindow.isVisible() && (isWin ? true : browserWindow.isFocused())
}

export const setFullScreen = (isFullScreen: boolean): boolean => {
  if (!browserWindow) return false
  if (isLinux) {
    if (isFullScreen) {
      browserWindow.setResizable(isFullScreen)
      browserWindow.setFullScreen(isFullScreen)
    } else {
      browserWindow.setFullScreen(isFullScreen)
      browserWindow.setResizable(isFullScreen)
    }
  } else {
    browserWindow.setFullScreen(isFullScreen)
  }
  return isFullScreen
}

export const showSelectDialog = async(options: Electron.OpenDialogOptions) => {
  if (!browserWindow) throw new Error('main window is undefined')
  return dialog.showOpenDialog(browserWindow, options)
}
export const showDialog = async({ type, message, detail }: Electron.MessageBoxOptions) => {
  if (!browserWindow) return
  dialog.showMessageBoxSync(browserWindow, {
    type,
    message,
    detail,
  })
}

export const showSaveDialog = async(options: Electron.SaveDialogOptions) => {
  if (!browserWindow) throw new Error('main window is undefined')
  return dialog.showSaveDialog(browserWindow, options)
}

export const clearCache = async() => {
  if (!browserWindow) throw new Error('main window is undefined')
  await browserWindow.webContents.session.clearCache()
}

export const getCacheSize = async() => {
  if (!browserWindow) throw new Error('main window is undefined')
  return browserWindow.webContents.session.getCacheSize()
}
export const getWebContents = (): Electron.WebContents => {
  if (!browserWindow) throw new Error('main window is undefined')
  return browserWindow.webContents
}

export const toggleDevTools = () => {
  if (!browserWindow) return
  if (browserWindow.webContents.isDevToolsOpened()) {
    browserWindow.webContents.closeDevTools()
  } else {
    handleOpenDevTools(browserWindow.webContents)
  }
}

export const setWindowBounds = (options: Partial<Electron.Rectangle>) => {
  if (!browserWindow) return
  browserWindow.setBounds(options)
}
export const setProgressBar = (progress: number, options?: Electron.ProgressOptions) => {
  if (!browserWindow) return
  browserWindow.setProgressBar(progress, options)
}

export const setIngoreMouseEvents = (ignore: boolean, options?: Electron.IgnoreMouseEventsOptions) => {
  if (!browserWindow) return
  browserWindow.setIgnoreMouseEvents(ignore, options)
}
const taskBarButtonFlags: LX.TaskBarButtonFlags = {
  empty: true,
  collect: false,
  play: false,
  next: true,
  prev: true,
}
export const setThumbarButtons = ({ empty, collect, play, next, prev }: LX.TaskBarButtonFlags = taskBarButtonFlags) => {
  if (!isWin || !browserWindow) return
  taskBarButtonFlags.empty = empty
  taskBarButtonFlags.collect = collect
  taskBarButtonFlags.play = play
  taskBarButtonFlags.next = next
  taskBarButtonFlags.prev = prev
  browserWindow.setThumbarButtons(createTaskBarButtons(taskBarButtonFlags, action => {
    sendTaskbarButtonClick(action)
  }))
}
