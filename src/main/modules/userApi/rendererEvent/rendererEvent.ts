
import { createWindow } from '../main'
import USER_API_RENDERER_EVENT_NAME from './name'
import { getUserApis } from '../utils'
import { sendEvent, sendStatusChange } from '@main/modules/winMain'
let userApi: LX.UserApi.UserApiInfo
let apiStatus: LX.UserApi.UserApiStatus = { status: true }
const requestQueue = new Map()
const timeouts = new Map<string, NodeJS.Timeout>()

interface InitParams {
  params: {
    status: boolean
    message: string
    data: LX.UserApi.UserApiInfo
  }
}

interface ResponseParams {
  params: {
    status: boolean
    message: string
    data: {
      requestKey: string
      result: any
    }
  }
}

interface UpdateInfoParams {
  params: {
    data: {
      log: string
      updateUrl: string
    }
  }
}

export const loadApi = async(apiId: string) => {
  if (!apiId) {
    apiStatus = { status: false, message: 'api id is null' }
    return sendStatusChange(apiStatus)
  }
  const targetApi = getUserApis().find(api => api.id === apiId)
  if (!targetApi) throw new Error('api not found')
  userApi = targetApi
  await createWindow(userApi)
}

export const setAllowShowUpdateAlert = (id: string, enable: boolean) => {
  if (!userApi || userApi.id != id) return
  userApi.allowShowUpdateAlert = enable
}

export const clearRequestTimeout = (requestKey: string) => {
  const timeout = timeouts.get(requestKey)
  if (timeout) {
    clearTimeout(timeout)
    timeouts.delete(requestKey)
  }
}

export const cancelRequest = (requestKey: string) => {
  if (!requestKey || !requestQueue.has(requestKey)) { return }
  const request = requestQueue.get(requestKey)
  request[1](new Error('Canceled request'))
  requestQueue.delete(requestKey)
  clearRequestTimeout(requestKey)
}

export const request = async({ requestKey, data }: LX.UserApi.UserApiRequestParams): Promise<any> => await new Promise((resolve, reject) => {
  if (!userApi) {
    reject(new Error('user api is not load'))
  }
  const timeout = timeouts.get(requestKey)
  if (timeout) {
    clearTimeout(timeout)
    timeouts.delete(requestKey)
    cancelRequest(requestKey)
  }

  timeouts.set(requestKey, setTimeout(() => {
    cancelRequest(requestKey)
  }, 20000))
  requestQueue.set(requestKey, [resolve, reject, data])
  sendRequest({ requestKey, data })
})

export const sendRequest = (reqData: { requestKey: string, data: any }) => {
  sendEvent(USER_API_RENDERER_EVENT_NAME.request, reqData)
}
