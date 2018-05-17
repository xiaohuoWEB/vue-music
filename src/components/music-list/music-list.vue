<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll"
            :data="songs"
            class="list"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {mapActions} from 'vuex'
  const RESERVED_HEIGHT = 40
  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight // 获取上半部分大的背景图可视区域高度
      // console.log(this.imageHeight)
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT // 因为滚动的数值是负数，所以是是 -this.imageHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px` // css3 滚动，列表的top 滚动到顶部指定位置
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      back() {
        this.$router.back()
      },
      scroll(pos) {
        this.scrollY = pos.y // 滚动的数值 赋值给 scrollY
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() { // 歌曲随机播放按钮，利用vuex actions 修改状态
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      // 关于滚动代码transform 加入浏览器前缀 webkit 的 可以使用 dom.js中prefixStyle 封装好的方法，个人觉得页面中这种更清晰的展现，所以没用dom封装的方法
      scrollY(newY) { // 滚动数值
        let zIndex = 0
        let scale = 1
        let blur = 0
        let tranlateY = Math.max(this.minTranslateY, newY) // 取滚动列表数值最大值
        this.$refs.layer.style['transform'] = `translate3d(0,${tranlateY}px,0)` // 歌曲列表无线滚动
        this.$refs.layer.style['webkittransform'] = `translate3d(0,${tranlateY}px,0)` // webkit

        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        if (newY < this.minTranslateY) { // 当滚动数值 小于 上面歌手大图可是区域高度滚动数值时候
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex // 防止歌曲文字滚动到外部时候仍然显示
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['webkittransform'] = `scale(${scale})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
