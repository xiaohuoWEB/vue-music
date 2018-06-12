import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

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

export function getMusicVkey(songmid, strMediaMid) {
  // const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const url = '/api/getMusicVkey'
  // const a = 'MusicJsonCallback' + (Math.random() + '').replace('0.', '')
  const data = Object.assign({}, commonParams, {
    format: 'json',
    songmid: songmid,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    uin: 0,
    loginUin: 0,
    hostUin: 0,
    cid: 205361747,
    guid: 2512456516,
    filename: `${'C400' + strMediaMid + '.m4a'}`
    // callback: a

  })
  /* const options = {
    // param: 'jsonpCallback',
    // name: a
  }
  return jsonp(url, data, options) */
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
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
