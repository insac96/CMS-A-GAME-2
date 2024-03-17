<template>
  <div>
    <LoadingTable v-if="!!load" />

    <!--Maintenance-->
    <div v-if="!load && !!config.maintenance">
      <DataEmpty text="Cửa hàng đang bảo trì, vui lòng quay lại sau" icon="i-bx-shopping-bag" />

      <UiFlex justify="end" class="mt-4">
        <UButton color="gray" @click="emit('close')">Đóng</UButton>
      </UiFlex>
    </div>

    <!-- Form -->
    <UForm :state="state" :validate="validate" @submit="submit" v-if="!load && !config.maintenance">
      <UFormGroup>
        <DataUserMini v-model:level="level" v-model:currency="currency" no-wheel />
      </UFormGroup>

      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup label="Giảm giá hệ thống" v-if="systemDiscount && systemDiscount.number > 0">
        <UInput :model-value="`${systemDiscount.number}% ${systemDiscount.time}`" readonly />
      </UFormGroup>

      <UFormGroup label="Vật phẩm" name="gift" v-if="!!pack && !!pack.gift">
        <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <DataItemList justify="center" :items="pack.gift" />
        </UCard>
      </UFormGroup>

      <UFormGroup label="Thông tin đơn hàng" name="info" v-if="!!pack && !!level && !!currency">
        <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6"> Mặt hàng</UiText>
            <UiText align="right">{{ pack.name }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Đơn giá</UiText>
            <UiText align="right">{{ toMoney(pack.price) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Giảm giá cấp độ</UiText>
            <UiText align="right">{{ `${level.discount}%` }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="systemDiscount && systemDiscount.number > 0">
            <UiText color="gray" class="mr-6">Giảm giá hệ thống</UiText>
            <UiText align="right">{{ `${systemDiscount.number}%` }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="totalPrice != null">
            <UiText color="gray" class="mr-6">Thành tiền</UiText>
            <UiText color="primary" weight="bold" align="right">{{ `${toMoney(totalPrice)} ${state.money == 'coin' ? 'Xu' : 'CH'}` }}</UiText>
          </UiFlex>
        </UCard>
      </UFormGroup>

      <UiFlex justify="end" class="mt-4">
        <UButton type="submit" :loading="buying" class="mr-1" v-if="!!isActive">Mua</UButton>
        <UButton color="gray" :disabled="buying" @click="emit('close')">Đóng</UButton>
      </UiFlex>
    </UForm>

    <!-- Limit -->
    <UModal v-model="modal">
      <DataShopLimit auth />
    </UModal>
  </div>
</template>

<script setup>
const { dayjs, displayFull } = useDayJs()
const { toMoney } = useMoney()

const props = defineProps(['pack', 'server'])
const emit = defineEmits(['close', 'done'])

const load = ref(true)
const config = ref({
  maintenance: true,
  discount: {
    number: null,
    expired: null
  }
})

const buying = ref(false)
const modal = ref(false)

const level = ref(undefined)
const currency = ref({ coin: null })

const state = ref({
  server: props.server ? props.server : null,
  role: null,
  pack: props.pack ? props.pack._id : null
})

const systemDiscount = computed(() => {
  let number = 0
  let time = ''
  const discount = parseInt(config.value.discount.number || 0)
  const expired = config.value.discount.expired || null

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
  const price = props.pack ? props.pack?.price : 0
  const discount_level = level.value ? level.value.discount : 0
  const discount_system = systemDiscount.value.number

  if(!price || price < 1) return null
  if(discount_level === undefined || discount_level < 0) return null

  let discount = discount_level + discount_system
  discount = discount > 100 ? 100 : discount

  let total = Math.floor(price)
  total = total - Math.floor(total * discount / 100)
  return total
})

const isActive = computed(() => {
  if(!level.value) return false
  if(!currency.value) return false
  return true
})

const validate = (state) => {
  const errors = []
  if (totalPrice.value == null) errors.push({ path: 'info', message: 'Không thể lấy thông tin giá tiền' })
  else if (totalPrice.value != null && currency.value.coin < totalPrice.value) errors.push({ path: 'info', message: 'Số dư xu không đủ' })
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const submit = async () => {
  try {
    buying.value = true
    const data = await useAPI('shop/pack/buy', JSON.parse(JSON.stringify(state.value)))

    buying.value = false
    emit('done', data)
    emit('close')
  }
  catch (e) {
    buying.value = false
  }
}

const getConfig = async () => {
  try {
    load.value = true

    const data = await useAPI('shop/config')
    config.value = Object.assign(config.value, data)

    load.value = false
  }
  catch (e) {
    load.value = false
  }
}
getConfig()
</script>