// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation 非常类似于事件
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}
export default mutations
