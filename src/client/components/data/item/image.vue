<template>
  <UiImg 
    v-if="imgLink"
    :src="imgLink"
    :img-w="Number(size) * 2"
    :img-h="Number(size) * 2"
    w="1" h="1" 
    class="
      transition-all 
      rounded-xl 
    "
    :style="{
      minWidth: size ? `${size}px` : null,
      minHeight: size ? `${size}px` : null,
      width: size ? `${size}px` : null,
      height: size ? `${size}px` : null,
      maxWidth: size ? `${size}px` : null,
      maxHeight: size ? `${size}px` : null,
    }"
  ></UiImg>
</template>

<script setup>
const configStore = useConfigStore()
const props = defineProps({
  src: String,
  type: [ String, Number ],
  size: { type: [ String, Number, undefined ], default: 55 }
})

const typeFormat = {
  'game_recharge': 'recharge',
  'game_item': 'item',
  'coin': 'coin',
  'wheel': 'wheel',
  'notify': 'notify',

  'empty-gift': 'empty-gift',
  'wheel_lose': 'wheel_lose'
}

const imgLink = computed(() => {
  if(!!props.src){
    const imagePath = configStore.config.game.image
    return !imagePath ? props.src : `${imagePath}/${props.src}`
  }
  else {
    if(!!props.type) return `/images/icon/${typeFormat[props.type]}.png`
    return null
  }
})
</script>