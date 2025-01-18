<script setup lang="ts">
import {nextTick, ref, useTemplateRef} from "vue";
import { addDragEvent } from "@/util/util.drag.ts";
import { addResizeEvent } from "@/util/util.resize.ts";

/**
 * TODO ::
 * - resize / drag 처리를 위한 함수들 분리
 */

const visible = ref(false)
const rootResizable = useTemplateRef('resizable')

// FlexiblePopover 토글
const toggle = (event: MouseEvent) => {
  if(visible.value) hide()
  else show(event)
}

// FlexiblePopover 보이기
async function show(event: MouseEvent) {
  visible.value = true

  await nextTick()

  if(rootResizable.value) {
    addDragEvent(rootResizable.value)
    addResizeEvent(rootResizable.value)
  }
}

// FlexiblePopover 숨기기
function hide() {
  visible.value = false
}

/**
 * 컴포넌트 제어 펑션 노출
 */
defineExpose({
  toggle
})
</script>

<template>
  <div v-if="visible" class="flexible" ref="resizable">
    <div class="flexible-container">

      <!-- 리사이즈 포인트 -->
      <div class="resizer top-left"></div>
      <div class="resizer top-middle"></div>
      <div class="resizer top-right"></div>
      <div class="resizer middle-left"></div>
      <div class="resizer middle-right"></div>
      <div class="resizer bottom-left"></div>
      <div class="resizer bottom-middle"></div>
      <div class="resizer bottom-right"></div>

      <!-- 드래그 포인트 -->
      <div class="drag-box">
        <div>헤더(드래그 영역)</div>
      </div>

      <!-- 컨텐츠 -->
      <div class="popover-contents">
        컨텐츠
      </div>
    </div>
  </div>

</template>

<style scoped>
.flexible {
  position: absolute;
  background: #C3E2CE;
  /* z-index 고민해보자 */
  z-index: 9;

  min-width: 250px;
  min-height: 250px;

  max-width: 1000px;
  max-height: 1000px;

  width: 300px;
  height: 300px;

  top: 200px;
  left: 500px;

  overflow: hidden;
}

.flexible .flexible-container {
  width: 100%;
  height: 100%;
  /* 박스 테두리 */
  border: 3px dashed #4286f4;
  box-sizing: border-box;
}

.flexible .flexible-container .resizer {
  width: 10px;
  height: 10px;
  background: white;
  border: 3px solid #4286f4;
  /* background: rgba(255,255,255, 0); */
  position: absolute;
}

.flexible .flexible-container .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.flexible .flexible-container .resizer.top-middle {
  left: calc(50% - 5px);
  top: -5px;
  cursor: ns-resize;
}
.flexible .flexible-container .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.flexible .flexible-container .resizer.middle-left {
  left: -5px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}
.flexible .flexible-container .resizer.middle-right {
  right: -5px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}
.flexible .flexible-container .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.flexible .flexible-container .resizer.bottom-middle {
  left: calc(50% - 5px);
  bottom: -5px;
  cursor: ns-resize;
}
.flexible .flexible-container .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}

.flexible-container .drag-box {
  padding: 10px;
  cursor: move;
  background-color: #C3E2CE;
  color: #000;
}

.flexible-container .popover-contents {
  width: 100%;
  height: calc(100% - 41px);
  background-color: white;
  overflow: auto;
}
</style>