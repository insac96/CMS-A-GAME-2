<template>
  <div 
    class="Dice" 
    :class="{
      'Dice--rolling': !!rolling
    }" 
    :style="{
      'transform': transform[number],
      '--dice-size': `${size}px`
    }"
  >
    <div :class="`Face Face-1`">
      <UiIcon class="Face-dot" :name="`i-bxs-dice-1`" :style="{ minWidth: `${size * 1.5}px`, minHeight:  `${size * 1.5}px` }" />
    </div>
    <div :class="`Face Face-2`">
      <UiIcon class="Face-dot" :name="`i-bxs-dice-2`" :style="{ minWidth: `${size * 1.5}px`, minHeight:  `${size * 1.5}px` }" />
    </div>
    <div :class="`Face Face-3`">
      <UiIcon class="Face-dot" :name="`i-bxs-dice-3`" :style="{ minWidth: `${size * 1.5}px`, minHeight:  `${size * 1.5}px` }" />
    </div>
    <div :class="`Face Face-4`">
      <UiIcon class="Face-dot" :name="`i-bxs-dice-4`" :style="{ minWidth: `${size * 1.5}px`, minHeight:  `${size * 1.5}px` }" />
    </div>
    <div :class="`Face Face-5`">
      <UiIcon class="Face-dot" :name="`i-bxs-dice-5`" :style="{ minWidth: `${size * 1.5}px`, minHeight:  `${size * 1.5}px` }" />
    </div>
    <div :class="`Face Face-6`">
      <UiIcon class="Face-dot" :name="`i-bxs-dice-6`" :style="{ minWidth: `${size * 1.5}px`, minHeight:  `${size * 1.5}px` }" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  rolling: Boolean,
  number: { type: Number, default: 0 },
  size: { type: Number, default: 70 },
})

const transform = {
  0: 'rotateX(45deg) rotateY(45deg)',
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(-90deg) rotateY(0deg)',
  3: 'rotateX(0deg) rotateY(90deg)',
  4: 'rotateX(0deg) rotateY(-90deg)',
  5: 'rotateX(90deg) rotateY(0deg)',
  6: 'rotateX(180deg) rotateY(0deg)'
}
</script>

<style lang="sass">
.Dice
  position: relative
  min-width: var(--dice-size)
  min-height: var(--dice-size)
  max-width: var(--dice-size)
  max-height: var(--dice-size)
  transform-style: preserve-3d
  transition: 1s ease

  @keyframes rolling
    50%
      transform: rotateX(450deg) rotateY(450deg) scale(0.8) scaleZ(0.8)

  &--rolling
    animation:  rolling 2s infinite

  .Face
    position: absolute
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    height: 100%
    transform-style: preserve-3d
    background: #000
    overflow: hidden
    box-shadow: 0 0 20px -10px rgba(0,0,0,0.3)
    .Face-dot
      background: linear-gradient(rgba(255,255,255,0.9), #fff)
      

  .Face-1
    transform: translateZ(calc(var(--dice-size) / 2))
  .Face-2
    transform: rotateX(90deg) translateZ(calc(var(--dice-size) / 2))
  .Face-3
    transform: rotateY(-90deg) translateZ(calc(var(--dice-size) / 2))
  .Face-4
    transform: rotateY(90deg) translateZ(calc(var(--dice-size) / 2))
  .Face-5
    transform: rotateX(-90deg) translateZ(calc(var(--dice-size) / 2))
  .Face-6
    transform: rotateX(180deg) translateZ(calc(var(--dice-size) / 2))
</style>