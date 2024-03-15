declare namespace LX {
  namespace UserApi{
    type UserApiSourceInfoType = 'music'
    type UserApiSourceInfoAction = 'musicUrl'

    interface UserApiSourceInfo {
      name: string
      type: UserApiSourceInfoType
      actions: UserApiSourceInfoAction[]
      qualitys: LX.Quality[]
    }

    type UserApiSources = Record<LX.Source, UserApiSourceInfo>
    type UserApiSetApiParams = string

    interface UserApiInfo {
      id: string
      name: string
      description: string
      script: string
      allowShowUpdateAlert: boolean
      sources?: UserApiSources
    }

    interface UserApiSetAllowUpdateAlertParams {
      id: string
      enable: boolean
    }

    interface UserApiRequestParams {
      requestKey: string
      data: any
    }

    interface UserApiStatus {
      status: boolean
      message?: string
      apiInfo?: UserApiInfo
    }

    interface ImportUserApi {
      apiInfo: UserApiInfo
      apiList: UserApiInfo[]
    }
  }
}
