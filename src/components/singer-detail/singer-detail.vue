<template>
  <transition name="slide">
    <music-list :bg-image="bgImage" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getSingerDetail} from 'api/singer' // 获取歌手详情列表数据
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
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
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          // 一个object里面包含一个musicData的object，这个项目我们只需要musicData，所以可以这样定义：{musicData}
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
