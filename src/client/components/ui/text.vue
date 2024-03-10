<template>
  <p 
    :class="[
      'break-words',
      {[`text-${size}`] : !!size },
      {[`text-${color}-500 dark:text-${color}-400`] : !!color },
      {[`font-${weight}`] : !!weight },
      {[`text-${align}`] : !!align },
      {[`cursor-pointer`] : !!pointer },
      {[`truncate`] : !!mini },
    ]"
  >
    {{ text || undefined }}
    <slot></slot>
  </p>
</template>

<script setup>


const props = defineProps({
  text: String,
  size: String,
  weight: String,
  color: String,
  align: String,
  pointer: Boolean,
  mini: Boolean,
})
</script>