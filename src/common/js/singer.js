export default class Singer {
  // 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
