<script setup lang="ts">
import {type Component, nextTick, ref, useTemplateRef} from "vue";

/**
 * TODO ::
 * - Transition 적용
 * - zIndex 옵션 (base,auto)
 * - maxWidth / maxHeight 정의
 */

const flexibleOptions = withDefaults(defineProps<{
  contents: Component
  width?: number
  height?: number
  top?: number
  left?: number
  right?: number
  bottom?: number
}>(), {
  width: 300,
  height: 300,
})

const boxContainer = useTemplateRef('box-container')
const customTheme = ref({
  defaultWidth: `${flexibleOptions.width}px`,
  defaultHeight: `${flexibleOptions.height}px`,
  defaultTop: flexibleOptions.top?? null,
  defaultLeft: flexibleOptions.left?? null,
  defaultRight: flexibleOptions.right?? null,
  defaultBottom: flexibleOptions.bottom?? null,
})

const visible = ref(false)

// 컴포넌트 토글
const toggle = (event: MouseEvent) => {
  if(visible.value) hide()
  else show(event)
}

async function show(event: MouseEvent) {
  visible.value = true

  await nextTick()

  if(boxContainer.value) {
    setDefaultPosition(boxContainer.value)
    dragElement(boxContainer.value)
  } else {
    console.warn('box-container not found. Fail to add event!!')
    console.log(event)
  }
}

function hide() {
  visible.value = false
}

/**
 * 컴포넌트 제어 펑션 노출
 */
defineExpose({
  toggle
})

/**
 * 'update-data'
 *  - 상위 컴포넌트에 결과를 전달
 *  - 파라메터는 알 수 없으므로 가변인자로 정의
 */
const emit = defineEmits<{
  (e: 'update-data', ...params: any[]): void
}>()

/**
 * 초기 위치 지정
 *
 * @param el
 */
function setDefaultPosition(el: HTMLElement) {
  if(customTheme.value.defaultTop) el.style.top = customTheme.value.defaultTop + 'px'
  if(customTheme.value.defaultLeft) el.style.left = customTheme.value.defaultLeft + 'px'
  if(customTheme.value.defaultRight) el.style.right = customTheme.value.defaultRight + 'px'
  if(customTheme.value.defaultBottom) el.style.bottom = customTheme.value.defaultBottom + 'px'
}

/**
 * 드래그 이벤트 등록
 * @param el
 */
function dragElement(el: HTMLElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

  // 메시지 박스 헤더에 이벤트 등록
  const header = el.getElementsByClassName('drag-box-header')[0] as HTMLElement
  header.onmousedown = dragMouseDown

  /**
   * 마우스 버튼 누를때 관련 이벤트 등록
   * - onmouseup   : 이벤트 초기화
   * - onmousemove : 드래그 이벤트 등록
   *
   * @param e
   */
  function dragMouseDown(e: MouseEvent) {
    e.preventDefault()

    // 이벤트 발생 좌표
    pos3 = e.clientX
    pos4 = e.clientY

    el.onmouseup = closeDragElement
    el.onmousemove = elementDrag
  }

  /**
   * 드래그를 통한 위치이동
   *
   * @param e
   */
  function elementDrag(e: MouseEvent) {
    e.preventDefault()

    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    el.style.top = (el.offsetTop - pos2) + 'px'
    el.style.left = (el.offsetLeft - pos1) + 'px'
  }

  /**
   * 드래그 이벤트 해제
   */
  function closeDragElement() {
    el.onmouseup = null
    el.onmousemove = null
  }
}

/**
 * 자식 컴포넌트의 결과값을 상위 컴포넌트로 전달
 * @param params
 */
function updateData(...params: any[]) {
  emit('update-data', ...(params as []))
}
</script>

<template>
  <Transition name="flex">
    <div v-if="visible" class="drag-box-container" ref="box-container">
      <div class="drag-box-header">
        <div>헤더</div>
      </div>
      <div>
        <component :is="flexibleOptions.contents" @update-data="updateData"></component>
      </div>
    </div>
  </Transition>
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
  resize: both;}

.drag-box-header {
  padding: 10px;
  cursor: move;
  background-color: #C3E2CE;
  color: #000;
}
</style>