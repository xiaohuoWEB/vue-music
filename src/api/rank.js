import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() { // 歌单列表api
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'jsonp',
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getMusicList(topid) { // 歌单详情列表api
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5',
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid
  })
  return jsonp(url, data, options)
}
