<template>
  <scroll :data="result"
          class="suggest"
          ref="suggest"
          pullup="pullup"
          @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
          <img :src="avatarimg(item)" v-show="avatar(item)">
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" :title="title"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result :title="noresult()"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20 // 默认显示20条数据

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: { // 是否展示搜索结果
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        pullup: true, // 上拉加载传递给scroll组件进行开启功能
        result: [],
        hasMore: true
      }
    },
    methods: {
      search() { // 搜索词，第几页，显示搜索结果，数据展示数量
        this.page = 1 // 默认第一个页
        this.hasMore = true // 上拉加载更多为了显示loading组件
        this.$refs.suggest.scrollTo(0, 0) // 当上拉加载更多停在某一个位置后，重新搜索其他内容，也就是改变了query，要重置scroll到顶部，否则不显示搜索结果
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      noresult() {
        return `抱歉，未找到与${this.query}相关的结果。`
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) { // 想数组内并入需要的参数
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) { // 处理封装过后的数据结果 返回到本页面数据源
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getIconCls(item) {
        // 如果搜索歌曲的时候item.type = 1 列表前使用音乐图标 ， 如果搜索的是歌手 item.type = singer 列表前使用user用户图标
        if (item.type === TYPE_SINGER) {
          // return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      avatarimg(item) { // 如果有singer列表第一个就显示歌手头像
        if (item.type === TYPE_SINGER) {
          return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
        }
      },
      avatar(item) { // 判断如果是搜索结果如果是歌手 列表第一个就显示歌手头像，反之如果是歌曲，列表就是音乐图标
        if (!item.type) {
          return false
        } else {
          return true
        }
      },
      getDisplayName(item) { // 搜索结果列表歌曲名及对应的歌手
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          // color: $color-text-d 原有
          color: $color-theme
        img
          width: 25px;
          height: 25px;
          border-radius: 50%;
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
