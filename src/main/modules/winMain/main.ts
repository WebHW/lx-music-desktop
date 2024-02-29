import { BrowserWindow, session } from 'electron'
import { isLinux, isWin } from '@common/utils'
import { getWindowSizeInfo } from './utils'
import { openDevTools as handleOpenDevTools } from '@main/utils'
import path from 'node:path'
import { sendFocus } from './rendererEvent'
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
