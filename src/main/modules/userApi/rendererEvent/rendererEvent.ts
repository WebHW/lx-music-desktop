
import { createWindow } from '../main'
import { getUserApis } from '../utils'
import { sendStatusChange } from '@main/modules/winMain'
let userApi: LX.UserApi.UserApiInfo
let apiStatus: LX.UserApi.UserApiStatus = { status: true }

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
