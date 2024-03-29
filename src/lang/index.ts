import zh_cn from './zh-cn.json'
import zh_tw from './zh-tw.json'
import en_us from './en-us.json'

// 定义一个消息类型，它是一个记录，其中key是zh_cn、zh_tw或en_us中的一种，value是字符串
type Message = Record<keyof typeof zh_cn, string>
| Record<keyof typeof zh_tw, string>
| Record<keyof typeof en_us, string>

type Messages = Record<(typeof langs)[number]['locale'], Message>

const langs = [
  {
    name: '简体中文',
    locale: 'zh-cn',
    // alternate: 'zh-hans',
    country: 'cn',
    fallback: true,
    message: zh_cn,
  },
  {
    name: '繁体中文',
    locale: 'zh-tw',
    // alternate: 'zh-hk',
    country: 'cn',
    message: zh_tw,
  },
  {
    name: 'English',
    locale: 'en-us',
    country: 'us',
    message: en_us,
  },
] as const
export type {
  Messages,
  Message,
}
