function getRandomInt(min, max) { // 歌曲随机数
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) { // 歌曲随机排序
  let _arr = arr.slice() // 作为list副本，不会直接修改数组本身（list）
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
