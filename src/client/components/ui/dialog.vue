<template>
  <div class="UiDialog">
    <UiFlex class="UiDialog__Header px-4 text-xl">
      {{ title }}
      
      <UiIcon class="ml-auto" name="i-bx-x" pointer @click="emit('close')" />
    </UiFlex>

    <div class="UiDialog__Body p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title'])
const emit = defineEmits(['close'])
</script>

<style lang="sass">
.UiDialog
  border-radius: 15px
  &__Header
    background: url('/ui/btn-menu.png') no-repeat
    border-radius: 12px 12px 0 0
    height: 50px
    font-family: "UT"
</style>