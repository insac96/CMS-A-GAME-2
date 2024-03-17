<template>
  <UCard
    v-if="pack" 
    :ui="{ 
      base: 'relative transition-all cursor-pointer',
      background: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      rounded: 'rounded-xl',
      shadow: 'shadow-md hover:shadow-lg',
      body: { padding: 'px-2 sm:px-2 py-6 sm:py-6' },
      divide: '',
      ring: 'dark:ring-1 ring-0 hover:ring-2 dark:hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400'
    }"
  > 
    <UiText 
      color="primary"
      weight="bold"
      align="center"
      class="truncate lg:text-base text-sm mb-1 px-2"
    >
      {{ pack.name }}
    </UiText>

    <UiFlex justify="center" class="pointer-events-none my-6" >
      <DataItemListMini justify="center" :items="pack.gift" :max="max" />
    </UiFlex>

    <UiText 
      weight="semibold"
      :color="(!!systemDiscount && systemDiscount.number > 0) ? 'red' : 'gray'"
      align="center"
      class="truncate lg:text-xs text-[10px] mb-4"
    >
      {{ (!!systemDiscount && systemDiscount.number > 0) ? `Giảm giá ${systemDiscount.number}%` : `${pack.gift.length} vật phẩm` }}
    </UiText>
    
    <UiFlex justify="center">
      <UButtonGroup size="xs" orientation="horizontal">
        <UButton :label="miniMoney(totalPrice)" color="gray" />
        <UButton  color="primary" icon="i-bxs-dollar-circle"></UButton>
      </UButtonGroup>
    </UiFlex>
  </UCard>
</template>

<script setup>
const props = defineProps(['pack', 'config', 'max'])
const { miniMoney } = useMoney()
const { dayjs, displayFull } = useDayJs()

const systemDiscount = computed(() => {
  if(!props.config) return null

  let number = 0
  let time = ''
  const discount = parseInt(props.config.discount.number || 0)
  const expired = props.config.discount.expired || null

  if(!expired) number = discount, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = discount, time = `đến ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

const totalPrice = computed(() => {
  if(!props.pack) return 0
  if(!systemDiscount.value) return props.pack.price

  const discount_system = systemDiscount.value.number
  const total = props.pack.price - Math.floor(props.pack.price * discount_system / 100)
  return total
})
</script>