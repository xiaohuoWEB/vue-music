// 异步操作 或者 对mutation 进行封装
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song) { // 解决歌曲随机状态之后 index 值也需要与随机歌曲名称相对应
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQJUENCE_LIST, list)
  if (state.mode === playMode.random) { // 解决歌曲随机状态之后 index 值也需要与随机歌曲名称相对应
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list) // 非随机模式的执行
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) { // 歌手详情 【随机播放按钮操作】
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQJUENCE_LIST, list)
  let randomlist = shuffle(list)
  commit(types.SET_PLAYLIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
