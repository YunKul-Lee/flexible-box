<script setup lang="ts">
const emit = defineEmits<{
  'update-data': [params: any]
}>()

function callParent() {
  const params = {
    'key1': 'value1',
    'key2': 'value2'
  }
  emit('update-data', params)
}

</script>

<template>
  <div>
    <p>Child Comp1-1</p>
    <p>Child Comp1-2</p>
    <p>Child Comp1-3</p>
    <div>
      <button @click="callParent">emit</button>
    </div>
  </div>
</template>

<style scoped>

</style>