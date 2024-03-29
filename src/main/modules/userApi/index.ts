import { closeWindow } from './main'
import { getUserApis, importApi as handleImportApi, removeApi as handleRemoveApi, setAllowShowUpdateAlert as saveAllowShowUpdateAlert } from './utils'
import { loadApi, setAllowShowUpdateAlert as setRendererEventAllowShowUpdateAlert } from './rendererEvent/rendererEvent'

let userApiId: string | null
let apiStatus: LX.UserApi.UserApiStatus = { status: true }

export const getApiList = getUserApis

export const importApi = (script: string): LX.UserApi.ImportUserApi => {
  return {
    apiInfo: handleImportApi(script),
    apiList: getUserApis(),
  }
}
export const removeApi = async(ids: string[]): Promise<LX.UserApi.UserApiInfo[]> => {
  if (userApiId && ids.includes(userApiId)) {
    userApiId = null
    await closeWindow()
  }
  handleRemoveApi(ids)
  return getUserApis()
}
export const setApi = async(id: string) => {
  if (userApiId) {
    userApiId = null
    await closeWindow()
  }

  const apiList = getUserApis()
  if (!apiList.find(api => api.id === id)) {
    return
  }
  userApiId ||= id
  await loadApi(id)
}

export const getStatus = (): LX.UserApi.UserApiStatus => apiStatus

export const setAllowShowUpdateAlert = (id: string, enable: boolean) => {
  saveAllowShowUpdateAlert(id, enable)
  setRendererEventAllowShowUpdateAlert(id, enable)
}


export * from './rendererEvent/rendererEvent'
