import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) { // 歌词数据接口
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    uin: 0,
    notice: 0,
    needNewCode: 0,
    format: 'json',
    hostUin: 0,
    g_tk: 5381
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
