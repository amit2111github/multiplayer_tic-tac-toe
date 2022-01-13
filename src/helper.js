export const changeBox = (type, colorType, box, setColor) => {
  switch (type) {
    case 'One':
      for (let i = 0; i < 3; i++) {
        const set = new Set(box[i])
        if (set.has('')) continue
        setColor((old) => {
          const newColor = old.slice(0)
          newColor[i] = [colorType, colorType, colorType]
          return newColor
        })
        return
      }
      break
    case 'Two':
      for (let j = 0; j < 3; j++) {
        const set = new Set([box[0][j], box[1][j], box[2][j]])
        if (set.has('')) continue
        setColor((old) => {
          const newColor = old.slice(0)
          newColor[0][j] = colorType
          newColor[1][j] = colorType
          newColor[2][j] = colorType
          return newColor
        })
        return
      }
      break
    case 'Three':
      setColor((old) => {
        const newColor = old.slice(0)
        for (let i = 0; i < 3; i++) {
          newColor[i][i] = colorType
        }
        return newColor
      })
      break
    case 'Four':
      setColor((old) => {
        const newColor = old.slice(0)
        for (let i = 0, j = 2; i < 3 && j >= 0; ) {
          newColor[i][j] = colorType
          i++
          j--
        }
        return newColor
      })
      break
  }
}

export const drwaCheck = (box) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (box[i][j] === '') return false
    }
  }
  return true
}

export const checkGameFinished = (move, box) => {
  let ans = true
  for (let i = 0; i < 3; i++) {
    ans = true
    for (let j = 0; j < 3; j++) {
      if (move !== box[i][j]) ans = false
    }
    if (ans) return 'One'
  }
  ans = true
  for (let j = 0; j < 3; j++) {
    ans = true
    for (let i = 0; i < 3; i++) {
      if (move !== box[i][j]) ans = false
    }
    if (ans) return 'Two'
  }
  ans = true
  for (let i = 0; i < 3; i++) {
    if (move !== box[i][i]) ans = false
  }
  if (ans) return 'Three'
  ans = true
  for (let i = 0, j = 2; i < 3 && j >= 0; ) {
    if (move !== box[i][j]) ans = false
    i++
    j--
  }
  if (ans) return 'Four'
  return ans
}

export const cleanUp = (status, setGameEnded, setBox, setColor) => {
  setGameEnded(true)
  setTimeout(() => {
    alert(status)
    setBox([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ])
    setColor([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ])
  }, 1000)
}
