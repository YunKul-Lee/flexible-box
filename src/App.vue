<script setup lang="ts">
import { ref } from "vue"
import FlexibleBox from "@/components/FlexibleBox.vue"

import ChildComp1 from "@/components/ChildComp1.vue"
import ChildComp2 from "@/components/ChildComp2.vue"

const toggle = ref(false)
const toggle2 = ref(false)

function toggleButton() {
  toggle.value = !toggle.value
}

function toggleButton2() {
  toggle2.value = !toggle2.value
}
</script>

<template>
  <div>
    <button @click="toggleButton">메시지 박스1 띄우기</button>
    <p />
    <flexible-box v-if="toggle" :contents="ChildComp1" :width="350"></flexible-box>
    <p />
    <button @click="toggleButton2">메시지 박스2 띄우기</button>
    <p />
    <flexible-box v-if="toggle2" :contents="ChildComp2"></flexible-box>
  </div>
</template>

