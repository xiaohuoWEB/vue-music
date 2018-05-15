function getRandomInt(min, max) { // 歌曲随机数
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) { // 歌曲随机排序
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}
