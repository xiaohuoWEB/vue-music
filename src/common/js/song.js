import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import {getMusicVkey} from 'api/singer'

// let urlMap = {}
export default class Song {
  // 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
  constructor({id, mid, strMediaMid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.strMediaMid = strMediaMid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this._genUrl()
  }

  getLyric() { // 获取歌词数据及封装歌词接口
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
// eslint-disable-next-line prefer-promise-reject-errors
          reject('no lyric')
        }
      })
    })
  }
  _genUrl () { // 获取歌曲vkey 数据对应每首歌曲
    if (this.url) {
      return
    }
    // console.log(this.mid + '~~~~~~~~~~')
    // console.log(this.strMediaMid)
    let strMediaMids = ''
    if (this.strMediaMid) {
      strMediaMids = this.strMediaMid
    } else {
      strMediaMids = this.mid
    }
    getMusicVkey(this.mid, strMediaMids).then((res) => {
      if (res.code === ERR_OK) {
        const vkey = res.data.items[0].vkey
        this.url = `http://dl.stream.qqmusic.qq.com/C400${strMediaMids}.m4a?vkey=${vkey}&guid=2512456516&uin=0&fromtag=66`
        // urlMap[this.id] = this.url
      }
    })
  }
}

export function createSong(musicData) { // 封装 歌曲所需要的数据
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    strMediaMid: musicData.strMediaMid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // url: await getSongURL(musicData.songmid, musicData.strMediaMid)
  })
}

/* function getSongURL(songmid, strMediaMid) { // 获取歌曲路径
  // console.log(strMediaMid)
  // (songmid用于Vkey接口的songmid, strMediaMid用于Vkey接口的filename  *****此参数是歌曲的核心源****** )
  return new Promise((resolve, reject) => {
    resolve(getMusicVkey(songmid, strMediaMid).then((res) => {
      return `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?guid=2512456516&vkey=${res.data.items[0].vkey}&uin=0&fromtag=66`
    }))
  })
} */

export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
