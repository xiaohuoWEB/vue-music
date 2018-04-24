<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getSingerDetail, getMusicqq} from 'api/singer' // 获取歌手详情列表数据
  import {createSong} from 'common/js/song'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer' // 对应getters 的变量名
      ])
    },
    created() {
      // console.log(this.singer)
      this._getDetail() // 获取歌手详情列表数据
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) { // 如果没有 id 值就回退到 歌手列表组件，一般刷新会导致获取不到id
          this.$router.push('/singer')
          return
        }
        // 传参到歌手详情请求 getSingerDetail(this.singer.id)
        getSingerDetail(this.singer.id).then((res) => { // 正常点击获取歌手详情数据
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          // 一个object里面包含一个musicData的object，这个项目我们只需要musicData，所以可以这样定义：{musicData}
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            // ret.push(createSong(musicData))
            getMusicqq(musicData.songmid).then((res) => {
              if (res.code === ERR_OK) {
                let musicvkey = []
                musicvkey.push(res.data.items[0].vkey)
                ret.push(createSong(musicData, musicvkey))
                return musicvkey
              }
            })
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
