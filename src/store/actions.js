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

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() // 播放列表
  let sequenceList = state.sequenceList.slice() // 随机列表经过计算后得到的
  let currentIndex = state.currentIndex // 当前播放索引
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 通过findIndex查询当前歌曲是否有待插入的歌曲并返回索引
  let fpIdex = findIndex(playlist, song)
  // 插入的位置是当前索引的下一个(因为是插入歌曲，所以索引要+1)
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIdex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIdex) {
      playlist.splice(fpIdex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIdex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQJUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
