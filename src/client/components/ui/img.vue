<template>
  <div 
    class="relative select-none"
    :style="`aspect-ratio: ${w} / ${h}`"
  >
    <NuxtImg 
      :src="imgLink(src)" 
      class="object-cover w-full h-full select-none"
      :sizes="props.imgSize"
      :width="props.imgW"
      :height="props.imgH"
      quality="100"
      format="webp"
      fit="cover"
      :loading="!!preload ? 'eager' : 'lazy'"
      :preload="preload"
      placeholder="/images/placeholder.png"
      :alt="props.alt" 
      @load="onLoad"
      :style="{
        borderRadius: 'inherit'
      }"
    />

    <USkeleton 
      class="absolute top-0 left-0 rounded-none w-full h-full" 
      :style="{
        borderRadius: 'inherit'
      }"
      v-if="!!loading"
    ></USkeleton>
  </div>
</template>

<script setup>
const { imgLink } = useMakeLink()

const props = defineProps({
  src: String,
  imgSize: String,
  imgW: [ String, Number ],
  imgH: [ String, Number ],
  w: [ String, Number ],
  h: [ String, Number ],
  alt: { type: String, default: 'image' },
  preload: { type: Boolean, default: false },
})

const loading = ref(true)
const onLoad = () => (loading.value = false)
</script>