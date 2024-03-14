import { STORE_NAMES } from '@common/constants'
import { userApis as defaultUserApis } from './config'
import getStore from '@main/utils/store'

let userApis: LX.UserApi.UserApiInfo[] | null
export const getUserApis = (): LX.UserApi.UserApiInfo[] => {
  const electronStore_userApi = getStore(STORE_NAMES.USER_API)
  if (userApis) return userApis
  userApis = electronStore_userApi.get('userApis') as LX.UserApi.UserApiInfo[]
  if (!userApis) {
    userApis = defaultUserApis
    electronStore_userApi.set('userApis', userApis)
  }

  for (const api of userApis) {
    if (api.allowShowUpdateAlert == null) api.allowShowUpdateAlert = false
  }
  return userApis
}
