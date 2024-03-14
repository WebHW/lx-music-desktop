import { import as handleImportApi, getUserApis } from './utils'

export const importApi = (script: string): LX.UserApi.ImportUserApi => {
  return {
    apiInfo: handleImportApi(script),
    apiList: getUserApis(),
  }
}
