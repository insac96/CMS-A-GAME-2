<template>
  <div v-html="content" class="ql-editor UiEditorContent"></div>
</template>

<script setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css'
defineProps(['content'])
</script>

<style lang="sass">
.UiEditorContent
  line-height: 1.6rem
  padding: 0
  h2
    font-size: 1.5rem
    color: rgb(var(--color-primary-DEFAULT))
    margin-bottom: 10px
  img
    max-width: 100%
    margin: 0 auto
  a
    color: rgb(var(--color-primary-DEFAULT))
</style>