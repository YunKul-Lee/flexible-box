<script setup lang="ts">
import {type Component, onMounted, ref, useTemplateRef} from "vue";

const flexibleOptions = withDefaults(defineProps<{
  contents: Component
  width?: number
  height?: number
}>(), {
  width: 300,
  height: 300,
})

// const flexibleOptions = defineProps<{
//   contents: Component;
//   width: number;
//   height: number;
// }>()

const boxContainer = useTemplateRef('box-container')
const customTheme = ref({
  defaultWidth: `${flexibleOptions.width}px`,
  defaultHeight: `${flexibleOptions.height}px`
})

onMounted(() => {
  if(boxContainer.value) dragElement(boxContainer.value)

  console.log(customTheme.value.defaultWidth)
})

/**
 * 드래그 이벤트 등록
 * @param el
 */
function dragElement(el: HTMLElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

  const header = el.getElementsByClassName('drag-box-header')[0] as HTMLElement
  header.onmousedown = dragMouseDown

  function dragMouseDown(e: MouseEvent) {
    e.preventDefault()

    pos3 = e.clientX
    pos4 = e.clientY

    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }

  function elementDrag(e: MouseEvent) {
    e.preventDefault()

    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    el.style.top = (el.offsetTop - pos2) + 'px'
    el.style.left = (el.offsetLeft - pos1) + 'px'
  }

  function closeDragElement() {
    document.onmouseup = null
    document.onmousemove = null
  }
}

</script>

<template>
  <div class="drag-box-container" ref="box-container">
    <div class="drag-box-header">헤더</div>
    <div>
      <component :is="flexibleOptions.contents"></component>
    </div>
  </div>
</template>

<style scoped>
.drag-box-container {
  position: absolute;
  z-index: 9;
  background-color: #f1f1f1;
  border: 1px solid #d3d3d3;
  text-align: center;

  /* resize */
  min-width: 250px;
  min-height: 250px;
  width: v-bind("customTheme.defaultWidth");
  height: v-bind("customTheme.defaultHeight");
  overflow: hidden;
  resize: both;
}

.drag-box-header {
  padding: 10px;
  cursor: move;
  background-color: #C3E2CE;
  color: #000;
}
</style>