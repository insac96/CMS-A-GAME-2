<template>
  <UIcon 
    :name="name" 
    :class="[
      {[`w-${size} h-${size}`] : !!size },
      {[`text-${color}-500 dark:text-${color}-400`] : !!color },
      {[`cursor-pointer`] : !!pointer }
    ]"
  />
</template>

<script setup>
const props = defineProps({
  name: String,
  size: [ String, Number ],
  color: String,
  pointer: Boolean
})
</script>