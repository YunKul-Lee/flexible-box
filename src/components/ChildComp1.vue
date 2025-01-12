<script setup lang="ts">
const emit = defineEmits<{
  'update-data': [params: object, string, boolean, boolean, number, string]
}>()

function callParent() {
  const params = {
    'key1': 'value1',
    'key2': 'value2'
  }
  emit('update-data', params, '1', true, false, 2, "ABC")
}

</script>

<template>
  <div>
    <p>Child Comp1-1</p>
    <p>Child Comp1-2</p>
    <p>Child Comp1-3</p>
    <p>Child Comp1-4</p>
    <p>Child Comp1-5</p>
    <p>Child Comp1-6</p>
    <p>Child Comp1-7</p>
    <p>Child Comp1-8</p>
    <p>Child Comp1-9</p>
    <p>Child Comp1-10</p>
    <p>Child Comp1-11</p>
    <p>Child Comp1-12</p>
    <p>Child Comp1-13</p>
    <p>Child Comp1-14</p>
    <p>Child Comp1-15</p>
    <p>Child Comp1-16</p>
    <p>Child Comp1-17</p>
    <div>
      <button @click="callParent">emit</button>
    </div>
  </div>
</template>

<style scoped>

</style>