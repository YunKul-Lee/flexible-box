<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const rootResizable = useTemplateRef('resizable')

// function makeResizable(div: string) {
function makeResizable(el: HTMLElement) {
  const resizerList = el.querySelectorAll('.resizer')
  // 창크기 최소 사이즈(가로/세로)
  const minimum_size = 100

  let origin_width = 0;
  let origin_height = 0;
  let origin_x = 0;
  let origin_y = 0;
  let origin_mouse_x = 0;
  let origin_mouse_y = 0;

  // 8방향에 대한 이벤트 등록
  for(let i = 0, len = resizerList.length; i < len; i++) {
    const currentResizer = resizerList[i]
    // @ts-ignore
    currentResizer.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault()

      // 변경전 크기
      origin_width = el.getBoundingClientRect().width
      origin_height = el.getBoundingClientRect().height

      // 변경전 엘리먼트 시작점 (left, top)
      origin_x = el.getBoundingClientRect().left;
      origin_y = el.getBoundingClientRect().top;

      // 변경전 마우스 좌표
      origin_mouse_x = e.pageX;
      origin_mouse_y = e.pageY;

      // 리사이즈 이벤트 등록
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })

    /**
     * 리사이즈 처리
     */
    function resize(e: MouseEvent) {

      if(currentResizer.classList.contains('bottom-right')) {
        // 남동
        const width = origin_width + (e.pageX - origin_mouse_x)
        const height = origin_height + (e.pageY - origin_mouse_y)
        if (width > minimum_size) {
          el.style.width = width + 'px'
        }
        if (height > minimum_size) {
          el.style.height = height + 'px'
        }

      } else if (currentResizer.classList.contains('bottom-middle')) {
        // 남
        const height = origin_height + (e.pageY - origin_mouse_y)
        if (height > minimum_size) {
          el.style.height = height + 'px'
        }

      } else if(currentResizer.classList.contains('bottom-left')) {
        // 남서
        const width = origin_width - (e.pageX - origin_mouse_x)
        const height = origin_height + (e.pageY - origin_mouse_y)
        if (height > minimum_size) {
          el.style.height = height + 'px'
        }
        if (width > minimum_size) {
          el.style.width = width + 'px'
          el.style.left = origin_x + (e.pageX - origin_mouse_x) + 'px'
        }
      } else if (currentResizer.classList.contains('middle-left')) {
        // 서
        const width = origin_width - (e.pageX - origin_mouse_x)
        if (width > minimum_size) {
          el.style.width = width + 'px'
          el.style.left = origin_x + (e.pageX - origin_mouse_x) + 'px'
        }

      } else if(currentResizer.classList.contains('middle-right')) {
        // 동
        const width = origin_width + (e.pageX - origin_mouse_x)
        if (width > minimum_size) {
          el.style.width = width + 'px'
        }

      } else if(currentResizer.classList.contains('top-right')) {
        // 동북
        const width = origin_width + (e.pageX - origin_mouse_x)
        const height = origin_height - (e.pageY - origin_mouse_y)
        if (width > minimum_size) {
          el.style.width = width + 'px'
        }
        if (height > minimum_size) {
          el.style.height = height + 'px'
          el.style.top = origin_y + (e.pageY - origin_mouse_y) + 'px'
        }

      } else if(currentResizer.classList.contains('top-middle')) {
        // 북
        const height = origin_height - (e.pageY - origin_mouse_y)
        if (height > minimum_size) {
          el.style.height = height + 'px'
          el.style.top = origin_y + (e.pageY - origin_mouse_y) + 'px'
        }

      } else if(currentResizer.classList.contains('top-left')) {
        // 서북
        const width = origin_width - (e.pageX - origin_mouse_x)
        const height = origin_height - (e.pageY - origin_mouse_y)
        if (width > minimum_size) {
          el.style.width = width + 'px'
          el.style.left = origin_x + (e.pageX - origin_mouse_x) + 'px'
        }
        if (height > minimum_size) {
          el.style.height = height + 'px'
          el.style.top = origin_y + (e.pageY - origin_mouse_y) + 'px'
        }

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
  if(rootResizable.value) {
    makeResizable(rootResizable.value)
  }
  // makeResizable('.resizable')
})
</script>

<template>
  <div class="resizable" ref="resizable">
    <div class="resizer-container">
      <div class="resizer top-left"></div>
      <div class="resizer top-middle"></div>
      <div class="resizer top-right"></div>
      <div class="resizer middle-left"></div>
      <div class="resizer middle-right"></div>
      <div class="resizer bottom-left"></div>
      <div class="resizer bottom-middle"></div>
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
  background: white;
  border: 3px solid #4286f4;
  /* background: rgba(255,255,255, 0); */
  position: absolute;
}

.resizable .resizer-container .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.resizable .resizer-container .resizer.top-middle {
  left: calc(50% - 5px);
  top: -5px;
  cursor: ns-resize;
}
.resizable .resizer-container .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.resizable .resizer-container .resizer.middle-left {
  left: -5px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}
.resizable .resizer-container .resizer.middle-right {
  right: -5px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}
.resizable .resizer-container .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.resizable .resizer-container .resizer.bottom-middle {
  left: calc(50% - 5px);
  bottom: -5px;
  cursor: ns-resize;
}
.resizable .resizer-container .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>