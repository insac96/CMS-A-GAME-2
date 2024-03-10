<template>
  <div class="Wheel border-b-4 border-primary px-4 py-8">
    <div 
      class="WheelBox" 
      :class="{ 'WheelBox--NoSpinning' : !!free }"
      :style="{ '--wheel-deg': `${deg.now - 36}deg` }"
    >
      <div 
        v-for="(item, i) in list" :key="i" 
        class="
          WheelItem 
          shadow-md
          bg-gray-100 dark:bg-gray-800
          rounded-xl
        "
        :class="{
          'ring-2 ring-primary': !anim && index == i
        }"
        :style="{ '--wheel-item-index' : i + 1 }"
      >
        <DataItem class="mx-auto" :item="item" :amount="item.type != 'wheel_lose' ? item.amount : 0" size="80"  />
      </div>
    </div>

    <div class="WheelArrow">
      <div class="WheelArrowItem bg-primary"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  spin: { type: Number },
  giftId: { type: String },
  items: { type: Array, default: () => []}
})

const emit = defineEmits(['done'])

const free = ref(true)
const anim = ref(null)
const deg = ref({
  now: 0,
  end: 0
})
const index = ref(null)

const list = computed(() => {
  const items = props.items
  const itemCount = items.length
  const missingCount = 10 - itemCount

  if(missingCount == 0) return items

  for (let i = 0; i < missingCount; i++) {
    items.push({ _id: null, name: 'Không có phần thưởng', type: 'empty-gift' })
  }

  return items
})

watch(() => props.spin, () => startAnim())

const getGiftDeg = () => {
  if(!props.giftId) return null
  const indexGift = list.value.findIndex(i => i._id == props.giftId)
  if(indexGift === -1) return null

  index.value = indexGift
  const max = Math.ceil((36 * index.value)) + 8
  const min = Math.floor((36 * index.value)) - 8
  return Math.floor(Math.random() * (max - min) + min)  * -1
}

const startAnim = () => {
  const giftDeg = getGiftDeg()
  if(!giftDeg) return emit('done')

  if(!!free.value) free.value = false
  index.value = null
  
  deg.value.end = giftDeg + (Math.floor(deg.value.end / 360) - 5) * 360
  anim.value = window.requestAnimationFrame(animation)
}

const animation = () => {
  if(deg.value.now > deg.value.end){
    deg.value.now -= Math.floor(Math.PI * 18)
    window.requestAnimationFrame(animation)
  }
  else {
    deg.value.now = deg.value.end
    window.cancelAnimationFrame(animation)
    setTimeout(() => {
      anim.value = null
      emit('done')
    }, 2000)
  }
}
</script>

<style lang="sass">
.dark
  .Wheel
    .WheelArrow
      filter: drop-shadow(0px -2px 3px rgba(0, 0, 0, 1))

.Wheel
  position: relative
  display: flex
  justify-content: center
  align-items: center
  -webkit-mask: linear-gradient(90deg, transparent, #fff 40%, #fff 60%, transparent)
  mask: linear-gradient(90deg, transparent, #fff 40%, #fff 60%, transparent)
  overflow: hidden

  @keyframes spinwheel
    0%
      transform: perspective(1200px) rotateY(-36deg)
    100%
      transform: perspective(1200px) rotateY(-396deg)

  .WheelArrow
    position: absolute
    width: 35px
    height: 35px
    bottom: 0
    z-index: 1
    .WheelArrowItem
      width: 100%
      height: 100%
      clip-path: polygon(50% 0%, 20% 100%, 80% 100%)

  .WheelBox
    position: relative
    width: 120px
    height: 120px
    transform-style: preserve-3d
    transform: perspective(1200px) rotateY(var(--wheel-deg))
    transition: transform 2s ease
    
    &--NoSpinning
      animation: spinwheel 30s linear infinite
    
    .WheelItem
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      transform-origin: center
      transform-style: preserve-3d
      transform: rotateY(calc(var(--wheel-item-index) * 36deg)) translateZ(200px)
      -webkit-box-reflect: below 5px linear-gradient(transparent,transparent)
      box-reflect: below 5px linear-gradient(transparent,transparent)
      transition: all 0.5s ease
      &:hover
        transform: rotateY(calc(var(--wheel-item-index) * 36deg)) translateZ(200px) scale(1.1)
</style>