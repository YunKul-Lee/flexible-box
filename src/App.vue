<script setup lang="ts">
import { ref } from "vue"
import FlexibleBox from "@/components/FlexibleBox.vue"

import ChildComp1 from "@/components/ChildComp1.vue"
import ChildComp2 from "@/components/ChildComp2.vue"

const op1 = ref()
const op2 = ref()


const toggle1 = (event: MouseEvent): void => {
  op1.value.toggle(event)
}

const toggle2 = (event: MouseEvent): void => {
  op2.value.toggle(event)
}

function updateData(params: object) {
  console.log(params)
}

</script>

<template>
  <div>
    <button @click="toggle1">메시지 박스1 띄우기</button>
    <p />
    <flexible-box ref="op1" @update-data="updateData" :contents="ChildComp1" :width="300"></flexible-box>
    <p />
    <button @click="toggle2">메시지 박스2 띄우기</button>
    <p />
    <flexible-box ref="op2" :contents="ChildComp2" :width="300"></flexible-box>
  </div>
</template>

