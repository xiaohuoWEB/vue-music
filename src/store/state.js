// 状态管理（状态树）
import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false, // 是否播放
  funllScreen: false, // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 随机列表经过计算后得到的
  mode: playMode.sequence, // 默认播放模式 顺序播放
  currentIndex: -1, // 当前播放索引
  disc: {}, // 首页推荐歌曲列表详情
  topList: {}// 歌单列表
}
export default state
