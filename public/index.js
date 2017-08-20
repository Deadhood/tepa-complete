let idx = 0
setInterval(() => {
  document.body.style.backgroundImage = `url(${window.bgImages[idx]})`
  idx++
  if (idx === window.bgImages.length) {
    idx = 0
  }
}, 3000)