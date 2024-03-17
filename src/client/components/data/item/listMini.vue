<template>
  <UiFlex :justify="justify" class="gap-2">
    <UiText color="gray" v-if="!items || items.length == 0">{{empty || 'Không có phần thưởng'}}</UiText>
    
    <UAvatarGroup :max="max" :size="size" :ui="{ ring: 'ring-0' }">
      <UAvatar
        v-for="(item, index) in items" :key="index"
        :src="imgLink(item.image, item.type)"
        :alt="item.name"
        :chip-text="'x'+useMoney().miniMoney(item.amount)"
        :chip-color="amountColor"
        chip-position="bottom-right"
        :ui="{
          chip: {
            base: 'text-white dark:text-white ring-0 font-bold'
          }
        }"
      />
    </UAvatarGroup>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const props = defineProps({
  items: Array,
  empty: String,
  justify: String,
  max: { type: Number, default: 5 },
  size: { type: String, default: 'lg' },
  amountColor: { type: String, default: 'gray' }
})

const typeFormat = {
  'game_recharge': 'recharge',
  'game_item': 'item',
  'coin': 'coin',
  'wheel': 'wheel',

  'empty-gift': 'empty-gift',
  'wheel_lose': 'wheel_lose'
}

const imgLink = (src, type) => {
  if(!!src){
    const imagePath = configStore.config.game.image
    return !imagePath ? src : `${imagePath}/${src}`
  }
  else {
    if(!!type) return `/images/icon/${typeFormat[type]}.png`
    return null
  }
}
</script>