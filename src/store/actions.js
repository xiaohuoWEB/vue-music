// 异步操作 或者 对mutation 进行封装
import * as types from './mutation-types'
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQJUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
