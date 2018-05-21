<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getSongList} from 'api/recommend'
  import {createSong} from 'common/js/song'

  export default {
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() { // 推荐歌单详情
        if (!this.disc.dissid) { // 如果没有dissid 就返回到首页
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => { // 推荐歌单详情api数据接口
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist) // 保存到data定义的数组里，传递给music-list组件显示列表数据
          }
        })
      },
      _normalizeSongs(list) { // 和歌手详情列表保持一致，一定要有 songid 和 albummid
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            createSong(musicData).then(result => {
              console.log(result)
              ret.push(result)
            })
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
