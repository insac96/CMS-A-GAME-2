<template>
  <UiFlex justify="center" class="p-4">
    <DataMinigameDiceItem :rolling="rolling" :number="dices[0]" class="mx-4" />
    <DataMinigameDiceItem :rolling="rolling" :number="dices[1]" class="mx-4" />
    <DataMinigameDiceItem :rolling="rolling" :number="dices[2]" class="mx-4" />
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  rolling: Boolean,
  dices: { type: Array, default: () => [0,0,0]}
})
</script>