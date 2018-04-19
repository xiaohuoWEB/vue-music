<template>
  <scroll :data="data"
          @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          class="listview" ref="listview">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="(item,index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :class="{'current': currentIndex === index}" :data-index="index" :key="index" class="item">{{item}}
      </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom' // 公共方法获取dom元素上面的 data-index 属性
  import Loading from 'base/loading/loading'

  const TITLE_HEIGHT = 30 // fixedtop 字母定位的高度 审查元素可以看到
  const ANCHOR_HEIGHT = 18 // 字体高度（字母） css 样式设置的高度 ，审查元素放到字母上面可以看到

  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
        // diff 和 scrollY 属性值之所以设置为 -1 因为是 0 的时候对【热门】第一个位置修改位置滑动
      }
    },
    props: {
      data: {
        type: Array,
        default: () => []
      }
      // default不能直接写为：[]
    },
    created() {
      this.touch = {} // 为什么不放在data里暂存，因为data() 初始化会产生 get和set观测数据变化，这里我们不需要观测数据变化。放在这里只是为了使2个函数能共享数据
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    computed: {
      shortcutList() { // 右侧字母列表
        return this.data.map((group) => { // 数组的map方法遍历title
          return group.title.substr(0, 1) // 因为列表中有“热门” 需要字符串截取title 第一个
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) { // 如果滚动时 index 大于0 返回空， 代码 v-show="fixedTitle" 小于0 才会显示,只有是负数的时候才会显示
          return ''
        } else {
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) { // 点击右侧任意字母， 左侧列表滚动到相应位置
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY // y1 属于自定义 ， 这里是获取纵轴坐标
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) { // 连续滑动字母，左侧列表滚动到相应位置
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 1300)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        // 当滚动到顶部，newY>0 防止右侧高亮选中会消失
        if (newY > 0) { // 页面向下拉 newY 值越大
          this.currentIndex = 0
          return
        }

        // 在中间部分滚动
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
