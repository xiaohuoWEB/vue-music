import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() { // 歌手列表api数据接口
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    platform: 'yqq',
    uin: 0,
    notice: 0,
    needNewCode: 0,
    pagesize: 200,
    pagenum: 1,
    page: 'list',
    format: 'json',
    hostUin: 0,
    g_tk: 5381,
    key: 'all_all_all'
  })
  return jsonp(url, data, options)
}

export function test() {
  /* const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?' +
    'channel=singer&page=list&key=all_all_all&pagesize=100' +
    '&pagenum=1&g_tk=5381&jsonpCallback=GetSingerListCallback' +
    '&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0' */
}
