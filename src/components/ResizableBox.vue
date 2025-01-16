<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

function makeResizable(div: string) {
  const element = document.querySelector(div) as HTMLElement
  const resizerList = document.querySelectorAll(div + ' .resizer')

  for(let i = 0, len = resizerList.length; i < len; i++) {
    const currentResizer = resizerList[i]
    currentResizer.addEventListener('mousedown', (e) => {
      e.preventDefault()

      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })

    /**
     * 리사이즈 처리
     */
    function resize(e: MouseEvent) {
      if(currentResizer.classList.contains('bottom-right')) {
        element.style.width = e.pageX - element.getBoundingClientRect().left + 'px'
      } else if(currentResizer.classList.contains('bottom-left')) {
        element.style.width = element.getBoundingClientRect().right - e.pageX + 'px'
      }
    }

    /**
     * 리사이즈 이벤트 제거
     */
    function stopResize() {
      window.removeEventListener('mousemove', resize)
    }
  }
}

onMounted(() => {
  makeResizable('.resizable')
})
</script>

<template>
  <div class="resizable">
    <div class="resizer-container">
      <div class="resizer top-left"></div>
<!--      <div class="resizer top-middle"></div>-->
      <div class="resizer top-right"></div>
      <div class="resizer bottom-left"></div>
      <div class="resizer bottom-right"></div>
    </div>
  </div>
</template>

<style scoped>
.resizable {
  background: #C3E2CE;
  width: 200px;
  height: 200px;
  position: absolute;
  top: 200px;
  left: 500px;
}

.resizable .resizer-container {
  width: 100%;
  height: 100%;
  border: 3px dashed #4286f4;
  box-sizing: border-box;
}

.resizable .resizer-container .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: 3px solid #4286f4;
  position: absolute;
}

.resizable .resizer-container .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.resizable .resizer-container .resizer.top-middle {
  left: 47.5%;
  top: -5px;
  cursor: ns-resize;
}
.resizable .resizer-container .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.resizable .resizer-container .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.resizable .resizer-container .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>