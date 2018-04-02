<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot> <!-- 插槽，外部引入slider的时候，slider包裹的节点会在这里面 -->
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentPageIndex === index}" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      }
    },
    mounted() { // 完成挂载
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
        window.addEventListener('resize', () => {
          if (!this.slider) {
            return
          }
          this._setSliderWidth(true)
          this.slider.refresh()
        })
      }, 20)//  浏览器的刷新一般是17毫秒
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },

    methods: { // 方法
      _setSliderWidth(isResize) { // 计算宽度
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) { // 如果是轮播图&&如果是resize的情况下
          width += 2 * sliderWidth // 如果是窗口缩放情况下 改变图片宽度
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true, // 滚动方向
          scrollY: false,
          momentum: false, // 当快速滑动时是否开启滑动惯性
          snap: { // 为slider组件使用
            loop: this.loop, // 是否无缝循环轮播
            threshold: 0.3, // 用手指滑动时页面可切换的阀值，大于这个阀值时可以滑动到下一页
            speed: 400 // 轮播图切换的动画时间
          }
        })

        this.slider.on('scrollEnd', () => { // 派发scrollEnd事件,获取当前页currentPageIndex
          let pageIndex = this.slider.getCurrentPage().pageX // 获取索引
          /* if (this.loop) { // 如果是循环
             pageIndex += 0 // 因为循环模式下默认会节点拷贝了，所以实际index 应该 -1
          } */
          this.currentPageIndex = pageIndex // 赋值给当前currentPageIndex

          if (this.autoPlay) { // 判断如果是自动轮播
            clearTimeout(this.timer) // 清除定时器 重新载入轮播
            this._play()
          }
        })
        /* this.slider.on('beforeScrollStart', () => { // 手动滑动之前先判断是否是轮播状态
          if (this.autoPlay) {
            console.log('test')
            clearTimeout(this.timer)
          }
        }) */
      },
      _initDots() { // 初始化点的数量
        this.dots = new Array(this.children.length) // 长度根据节点length
      },
      _play() {
        // clearTimeout(this.timer)
        // let pageIndex = this.currentPageIndex + 1 // 此方法可用,属于另一种方法
        this.timer = setTimeout(() => {
          this.slider.next() // 下一张图片
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
