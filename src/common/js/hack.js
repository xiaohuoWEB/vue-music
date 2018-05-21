// hack for global nextTick
// 解决在ios 及 手机浏览器上不能播放音乐
function noop() {

}

window.MessageChannel = noop
window.setImmediate = noop
