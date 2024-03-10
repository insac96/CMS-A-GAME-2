<template>
  <div :class="{
    'UiEditor ring-1 ring-gray-200 dark:ring-gray-800 rounded-xl' : !loading
  }">
    <USkeleton class="w-full h-[250px] rounded-xl shadow-md" v-if="loading" />

    <ClientOnly>
      <QuillEditor 
        :content="content" 
        contentType="html" 
        :toolbar="toolbar" 
        theme="snow" fbwefbiwue
        @update:content="change"
        @ready="loading = false"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const loading = ref(true)
const content = ref(props.modelValue)
const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'header': 2 }, { 'list': 'bullet' }],
  [{ 'align': [] }, { 'color': [] }, 'link', 'image', 'video'],
]

const change = (value) => emit('update:modelValue', value)
</script>

<style lang="sass">
.UiEditor
  display: flex
  flex-direction: column
  overflow: hidden
  min-height: 250px
  max-height: 70vh
  .ql-container
    display: flex
    flex-direction: column
    flex-grow: 1
    width: 100%
    overflow-y: auto
    background: none
    border: none 
    font-family: inherit
    font-size: inherit
    .ql-editor
      flex-grow: 1
      line-height: 1.6rem
      img
        max-width: 100%
        margin: 0 auto
      h2
        font-size: 1.5rem
        color: rgb(var(--color-primary-DEFAULT))
        margin-bottom: 10px
      a
        color: rgb(var(--color-primary-DEFAULT))
  .ql-toolbar
    width: 100%
    border-top: none
    border-right: none
    border-left: none
    border-bottom: 1px solid rgb(var(--color-gray-200))
    font-family: inherit

.dark
  .UiEditor
    .ql-toolbar
      border-color: rgb(var(--color-gray-800))
</style>