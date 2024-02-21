// import { compareVer } from './index'

// const oldThemeMap = {
//   0: 'green',
//   1: 'blue',
//   2: 'yellow',
//   3: 'orange',
//   4: 'red',
//   10: 'pink',
//   5: 'purple',
//   6: 'grey',
//   11: 'ming',
//   12: 'blue2',
//   13: 'black',
//   7: 'mid_autumn',
//   8: 'naruto',
//   9: 'happy_new_year',
// } as const

export default (setting: any): Partial<LX.AppSetting> => {
  setting = { ...setting }

  // 迁移 v2.0.0 之前的配置

  // 迁移 v2.2.0 之前的设置数据

  return setting
}
