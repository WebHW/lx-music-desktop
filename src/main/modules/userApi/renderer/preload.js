import { contextBridge, ipcRenderer } from 'electron'
import USER_API_RENDERER_EVENT_NAME from '../rendererEvent/name'
import needle from 'needle'
import zlib from 'zlib'
import { createCipheriv, publicEncrypt, constants, randomBytes, createHash } from 'crypto'

for (const key of Object.keys(process.env)) {
  if (/^(?:http_proxy|https_proxy|NO_PROXY)$/i.test(key)) delete process.env[key]
}

let isInitedApi = false
let isShowedUpdateAlert = false
const EVENT_NAMES = {
  request: 'request',
  inited: 'inited',
  updateAlert: 'updateAlert',
}
const eventNames = Object.values(EVENT_NAMES)
const events = {
  request: null,
}
const allSources = ['kw', 'kg', 'tx', 'wy', 'mg']
const supportQualitys = {
  kw: ['128k', '320k', 'flac', 'flac24bit'],
  kg: ['128k', '320k', 'flac', 'flac24bit'],
  tx: ['128k', '320k', 'flac', 'flac24bit'],
  wy: ['128k', '320k', 'flac', 'flac24bit'],
  mg: ['128k', '320k', 'flac', 'flac24bit'],
}

const supportActions = {
  kw: ['musicUrl'],
  kg: ['musicUrl'],
  tx: ['musicUrl'],
  wy: ['musicUrl'],
  mg: ['musicUrl'],
  xm: ['musicUrl'],
}
const sendMessage = (action, data, status, message) => {
  ipcRenderer.send(action, { data, status, message })
}

const handleRequest = (context, { requestKey, data }) => {
  if (!events.request) return sendMessage(USER_API_RENDERER_EVENT_NAME.response, { requestKey }, false, 'Request evnet is not defined')

  try {
    events.request.call(context, { source: data.source, action: data.action, info: data.info }).then(response => {

    })
  } catch (error) {

  }
}

const handleShowUpdateAlert = (data, resolve, reject) => {
  if (!data || typeof data !== 'object') return reject(new Error('parameter format error.'))
  if (!data.log || typeof data.log !== 'string') return reject(new Error('log is required.'))
  if (data.updateUrl && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(data.updateUrl) && data.updateUrl.length > 1024) delete data.updateUrl
  if (data.log.length > 1024) data.log = data.log.substring(0, 1024) + '...'
  sendMessage(USER_API_RENDERER_EVENT_NAME.showUpdateAlert, {
    log: data.log,
    updateUrl: data.updateUrl,
  })
  resolve()
}

/**
 *
 * @param {*} context
 * @param {*} info {
 *                    openDevTools: false,
 *                    status: true,
 *                    message: 'xxx',
 *                    sources: {
 *                         kw: ['128k', '320k', 'flac', 'flac24bit'],
 *                         kg: ['128k', '320k', 'flac', 'flac24bit'],
 *                         tx: ['128k', '320k', 'flac', 'flac24bit'],
 *                         wy: ['128k', '320k', 'flac', 'flac24bit'],
 *                         mg: ['128k', '320k', 'flac', 'flac24bit'],
 *                     }
 *                 }
 */
const handleInit = (context, info) => {
  if (!info) {
    return sendMessage(USER_API_RENDERER_EVENT_NAME.init, null, false, 'Init failed')
  }
  if (info.openDevTools === true) {
    sendMessage(USER_API_RENDERER_EVENT_NAME.openDevTools)
  }
  if (!info.status) {
    return sendMessage(USER_API_RENDERER_EVENT_NAME.init, null, false, 'Init failed')
  }
  const sourceInfo = {
    sources: {},
  }
  try {
    for (const source of allSources) {
      const userSource = info.sources[source]
      if (!userSource || userSource.type !== 'music') continue
      const qualitys = supportQualitys[source]
      const actions = supportActions[source]
      sourceInfo.sources[source] = {
        type: 'music',
        actions: actions.filter(a => userSource.actions.includes(a)),
        qualitys: qualitys.filter(q => userSource.qualitys.includes(q)),
      }
    }
  } catch (error) {
    console.error(error)
    return sendMessage(USER_API_RENDERER_EVENT_NAME.init, null, false, error.message)
  }
  sendMessage(USER_API_RENDERER_EVENT_NAME.init, sourceInfo, true)
  ipcRenderer.on(USER_API_RENDERER_EVENT_NAME.request, (event, data) => {
    handleRequest(context, data)
  })
}

contextBridge.exposeInMainWorld('lx', {
  EVENT_NAMES,
  request(url, { method = 'GET', timeout, body, headers, form, formData }, callback) {
    let options = { headers }
    let data
    if (body) {
      data = body
    } else if (form) {
      options.json = false
    } else if (formData) {
      data = formData
      options.json = false
    }
    options.request_timeout = timeout
    let request = needle.request(method, url, data, options, (err, resp, body) => {
      if (!err) {
        body = resp.body = resp.raw.toString()
        try {
          resp.body = JSON.parse(resp.body)
        } catch (_) {}
        body = resp.body
      }

      callback(err, {
        statusCode: resp.statusCode,
        statusMessage: resp.statusMessage,
        headers: resp.headers,
        bytes: resp.bytes,
        raw: resp.raw,
        body,
      }, body)
    }).request
    return () => {
      if (!request.aborted) request.abort()
      request = null
    }
  },
  send(eventName, data) {
    return new Promise((resolve, reject) => {
      if (!eventNames.includes(eventName)) return reject(new Error('The event is not supported: ' + eventName))
      switch (eventName) {
        case EVENT_NAMES.inited:
          if (isInitedApi) return reject(new Error('Script is inited'))
          isInitedApi = true
          handleInit(this.data)
          break
        case EVENT_NAMES.updateAlert:
          if (isShowedUpdateAlert) return reject(new Error('The update alert can only be called once.'))
          isShowedUpdateAlert = true
          handleShowUpdateAlert(data, resolve, reject)
          break
        default:
          reject(new Error('Unknown event name: ' + eventName))
      }
    })
  },
  on(eventName, handler) {
    if (!eventNames.includes(eventName)) return Promise.reject(new Error('The event is not supported: ' + eventName))
    switch (eventName) {
      case EVENT_NAMES.request:
        events.request = handler
        break
      default: return Promise.reject(new Error('The event is not supported: ' + eventName))
    }
    return Promise.resolve()
  },
  utils: {
    crypto: {
      aesEncrypt(buffer, mode, key, iv) {
        const chiper = createCipheriv(mode, key, iv)
        return Buffer.concat([chiper.update(buffer), chiper.final()])
      },
      rsaEncrypt(buffer, key) {
        buffer = Buffer.concat([buffer.alloc(128 - buffer.length), buffer])
        return publicEncrypt({ key, padding: constants.RSA_NO_PADDING }, buffer)
      },
      randomBytes(size) {
        return randomBytes(size)
      },
      md5(str) {
        return createHash('md5').update(str).digest('hex')
      },

    },
    buffer: {
      from(...args) {
        return Buffer.from(...args)
      },
      bufToString(buf, format) {
        return Buffer.from(buf, 'binary').toString(format)
      },

    },
    zlib: {
      inflate(buf) {
        return new Promise((resolve, reject) => {
          zlib.inflate(buf, (err, result) => {
            if (err) {
              reject(new Error(err.message))
            } else resolve(buf)
          })
        })
      },
    },
  },
  version: '1.3.0',
})
