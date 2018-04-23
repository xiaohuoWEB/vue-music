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
    pagesize: 100,
    pagenum: 1,
    page: 'list',
    format: 'json',
    hostUin: 0,
    g_tk: 5381,
    key: 'all_all_all'
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })
  return jsonp(url, data, options)
}
