<template>
  <div class="xl:hidden">
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none overflow-hidden" :style="style" ref="el" @click="openMenu">
      <UiImg v-if="!!configStore.config.logo_image" :src="configStore.config.logo_image" w="1" h="1" img-w="100" img-h="100" class="w-full h-full" />
      
      <UiIcon v-else name="i-bx-menu" color="primary" size="8" />
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 2;" v-if="!!dragging"></div>

    <USlideover v-model="open" side="left" :ui="{
      width: 'w-screen max-w-[250px]'
    }">
      <LayoutDefaultNav @to="open = false"/>
    </USlideover>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const configStore = useConfigStore()
const emits = defineEmits(['open'])

const el = ref(null)

const dragging = ref(false)

const open = ref(false)

const { style } = useDraggable(el, {
  initialValue: { x: -8, y: -8 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const openMenu = () => {
  if(!!dragging.value) return
  open.value = true
}
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 45px
  min-height: 45px
  width: 45px
  height: 45px
  max-width: 45px
  max-height: 45px
  z-index: 3
  cursor: pointer
</style>