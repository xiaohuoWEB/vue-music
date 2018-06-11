import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
// import {getMusicVkey} from 'api/singer'

export default class Song {
  // 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
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
}
export function createSong(musicData, songVkey) { // 封装 歌曲所需要的数据
  console.log(musicData.songmid)
  console.log(songVkey)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: 'http://dl.stream.qqmusic.qq.com/C400000QCwge3B6Ad1.m4a?vkey=54E3259AE0DA3F755FE6116913CFB43A26EAB1BAE441FEB2DE2E6358A0D48E18B01F9A69493DFDC6C429AD4B81E46E18336584E08A695DB7&guid=9310650592&uin=0&fromtag=66'
    // url: 'http://dl.stream.qqmusic.qq.com/C400000QCwge3B6Ad1.m4a?vkey=BFA6E5EE65D583AAD84B5BEC509690C6E3FC75F66F91F644273D1C1A3318BD252558B69C998C228A75ED8D11F39A9B1DC08926E5A1E1A9A1&guid=9310650592&uin=0&fromtag=66'
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=9310650592&uin=0&fromtag=66`
    /* url: await getSongURL(musicData.songmid).catch(function (err) {
      console.log('获取歌曲Vkey失败' + err)
    }) */
  })
}

/* function getSongURL(songmid) { // 获取歌曲路径
  // (songmid用于Vkey接口的songmid, strMediaMid用于Vkey接口的filename  *****此参数是歌曲的核心源****** )
  return new Promise((resolve, reject) => {
    resolve(getMusicVkey(songmid).then((res) => {
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
