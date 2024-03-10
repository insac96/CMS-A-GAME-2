<template>
  <div :class="[
    'flex',
    {[`flex-${type}`] : !!type },
    {[`justify-${justify}`] : !!justify },
    {[`items-${items}`] : !!items },
    {[`flex-wrap`] : !!wrap },
  ]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String },
  justify: { type: String },
  items: { type: String, default: 'center' },
  wrap: { type: Boolean },
})
</script>