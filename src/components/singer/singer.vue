<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {ERR_OK} from 'api/config'
  import {getSingerList} from 'api/singer' // 调用数据接口
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const OTH_NAME = '#' // 其他无匹配字母的歌手
  const HOT_SINGER_LEN = 10
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = { // 封装热门歌手列表map
          hot: {
            title: HOT_NAME,
            items: []
          },
          oth: {
            title: OTH_NAME,
            items: []
          }
        }
        list.forEach((item, index) => { // 遍历api接口数据前10条数据当作 热门歌手
          if (index < HOT_SINGER_LEN) { // index:10条
            map.hot.items.push(new Singer({ // 向热门map 里添加
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) { // 如果没有聚合对象就创建一个
            map[key] = {
              title: key,
              items: []
            }
          }
          if (map[key].title.match(/^[0-9]*$/)) {
            map.oth.items.push(new Singer({ // 向热门map.oth(其他) 里添加
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          } else {
            map[key].items.push(new Singer({ // 负值给map key
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
        })
        // 为了得到有序列表，我们需要处理 map
        let hot = [] // 热门，空数组等待存值
        let ret = [] // 列表 a-z
        let oth = []
        for (let key in map) {
          let val = map[key]
          if (val.title === OTH_NAME) {
            oth.push(val)
          } else if (val.title.match(/[A-Za-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => { // 字母按升序排列
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret, oth) // 合并数组
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
