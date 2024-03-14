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
    interface UserApiInfo {
      id: string
      name: string
      descriptions: string
      script: string
      allowShowUpdateAlert: boolean
      sources?: UserApiSources
    }

    interface ImportUserApi {
      apiInfo: UserApiInfo
      apiList: UserApiInfo[]
    }
  }
}
