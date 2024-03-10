<template>
  <div>
    <DataUserBox :fetch-id="user" v-model:user-data="userData">
      <template #more>
        <UDropdown :items="actions()" v-if="!!userData && !route.params._secret">
          <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
        </UDropdown>
      </template>
    </DataUserBox>

    <div class="px-4 pb-2">
      <UAccordion
        color="primary"
        variant="soft"
        size="md"
        :items="menu"
      >
        <template #default="{ item, open }">
          <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
            {{ item.label }}
          </UButton>
        </template>

        <template #log>
          <AdminUserLog :user="user" />
        </template>

        <template #statistical>
          <DataUserStatistical :user="user" />
        </template>

        <template #ip>
          <AdminUserIp :user="user" />
        </template>

        <template #payment>
          <DataPaymentHistory :user="user" />
        </template>

        <template #shop>
          <DataShopHistory :user="user" />
        </template>

        <template #event>
          <DataEventHistory :user="user" />
        </template>

        <template #giftcode>
          <DataGiftcodeHistory :user="user" />
        </template>
      </UAccordion>
    </div>

    <!-- Modal Edit Auth-->
    <UModal v-model="modal.editAuth" preventClose>
      <UForm :state="stateEditAuth" @submit="editAuthAction" class="p-4">
        <UFormGroup label="Email">
          <UInput v-model="stateEditAuth.email" />
        </UFormGroup>

        <UFormGroup label="Số điện thoại">
          <UInput v-model="stateEditAuth.phone" />
        </UFormGroup>

        <UFormGroup label="Mật khẩu">
          <UInput v-model="stateEditAuth.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Khóa">
          <SelectAuthBlock v-model="stateEditAuth.block" />
        </UFormGroup>

        <UFormGroup label="Quyền">
          <SelectAuthType v-model="stateEditAuth.type" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editAuth">Sửa</UButton>
          <UButton color="gray" @click="modal.editAuth = false" :disabled="loading.editAuth" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Currency-->
    <UModal v-model="modal.editCurrency" preventClose>
      <UForm :state="stateEditCurrency" @submit="editCurrencyAction" class="p-4">
        <UFormGroup label="Xu Web">
          <UInput v-model="stateEditCurrency.plus.coin" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.coin" type="number" v-if="stateEditCurrency.type == 'origin'" />
        </UFormGroup>

        <UFormGroup label="Lượt quay vòng may mắn">
          <UInput v-model="stateEditCurrency.plus.wheel" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.wheel" type="number" v-if="stateEditCurrency.type == 'origin'"/>
        </UFormGroup>

        <UFormGroup label="Lượt gửi thông báo">
          <UInput v-model="stateEditCurrency.plus.notify" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.notify" type="number" v-if="stateEditCurrency.type == 'origin'"/>
        </UFormGroup>

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditCurrency.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editCurrency">
            {{ stateEditCurrency.type == 'plus' ? 'Thêm' : 'Sửa' }}
          </UButton>
          <UButton color="gray" @click="modal.editCurrency = false" :disabled="loading.editCurrency" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Pay-->
    <UModal v-model="modal.editPay" preventClose>
      <UForm :state="stateEditPay" @submit="editPayAction" class="p-4" v-if="stateEditPay.pay">
        <UFormGroup label="Ngày">
          <UInput v-model="stateEditPay.pay.day.money" type="number" />
        </UFormGroup>

        <UFormGroup label="Tháng">
          <UInput v-model="stateEditPay.pay.month.money" type="number" />
        </UFormGroup>

        <UFormGroup label="Tổng">
          <UInput v-model="stateEditPay.pay.total.money" type="number" />
        </UFormGroup>

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditPay.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editPay">Sửa tích nạp</UButton>
          <UButton color="gray" @click="modal.editPay = false" :disabled="loading.editPay" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Spend-->
    <UModal v-model="modal.editSpend" preventClose>
      <UForm :state="stateEditSpend" @submit="editSpendAction" class="p-4" v-if="stateEditSpend.spend">
        <UFormGroup label="Ngày">
          <UInput v-model="stateEditSpend.spend.day.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Tháng">
          <UInput v-model="stateEditSpend.spend.month.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Tổng">
          <UInput v-model="stateEditSpend.spend.total.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditSpend.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editSpend">Sửa tiêu phí</UButton>
          <UButton color="gray" @click="modal.editSpend = false" :disabled="loading.editSpend" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Send Item-->
    <UModal v-model="modal.sendItem" preventClose :ui="{width: 'sm:max-w-[800px]'}">
      <AdminGameSend class="p-4" :user="stateSendItem.user" @close="modal.sendItem = false" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const route = useRoute()

const userData = ref(null)

const menu = [
  {
    label: 'Dòng thời gian',
    slot: 'log'
  },
  {
    label: 'Thông số',
    slot: 'statistical'
  },
  {
    label: 'Địa chỉ IP',
    slot: 'ip'
  },
  {
    label: 'Nạp tiền',
    slot: 'payment'
  },
  {
    label: 'Cửa hàng',
    slot: 'shop'
  },
  {
    label: 'Sự kiện',
    slot: 'event'
  },
  {
    label: 'Giftcode',
    slot: 'giftcode'
  }
]

// Modal
const modal = ref({
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editSpend: false,
  sendItem: false
})

// Loading
const loading = ref({
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editSpend: false,
})

// Stage
const stateEditAuth = ref({
  _id: null,
  email: null,
  phone: null,
  password: null,
  type: null,
  block: null
})

const stateEditCurrency = ref({
  type: null,
  plus: {
    coin: 0,
    wheel: 0,
    notify: 0
  },
  origin: {
    coin: null,
    wheel: null,
    notify: null
  },
  reason: null
})

const stateEditPay = ref({
  _id: null,
  pay: null,
  reason: null
})

const stateEditSpend = ref({
  _id: null,
  spend: null,
  reason: null
})

const stateSendItem = ref({
  user: null
})

// Watch
watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
  type: null,
  plus: {
    coin: 0,
    wheel: 0,
    notify: 0
  },
  origin: {
    coin: null,
    wheel: null,
    notify: null
  },
  reason: null
}))

watch(() => modal.value.editPay, (val) => !val && (stateEditPay.value.reason = null))
watch(() => modal.value.editSpend, (val) => !val && (stateEditSpend.value.reason = null))

// Action
const actions = () => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = userData.value[key])
      modal.value.editAuth = true
    }
  }],[{
    label: 'Thêm tiền tệ',
    icon: 'i-bx-coin-stack',
    click: () => {
      stateEditCurrency.value._id = userData.value._id
      stateEditCurrency.value.type = 'plus'
      modal.value.editCurrency = true
    }
  },{
    label: 'Sửa tiền tệ',
    icon: 'i-bx-coin',
    click: () => {
      Object.keys(stateEditCurrency.value.origin).forEach(key => stateEditCurrency.value.origin[key] = userData.value['currency'][key])
      stateEditCurrency.value._id = userData.value._id
      stateEditCurrency.value.type = 'origin'
      modal.value.editCurrency = true
    }
  }],[{
    label: 'Sửa tích nạp',
    icon: 'i-bx-wallet',
    click: () => {
      stateEditPay.value.pay = JSON.parse(JSON.stringify(userData.value.pay))
      stateEditPay.value._id = userData.value._id
      modal.value.editPay = true
    }
  },{
    label: 'Sửa tiêu phí',
    icon: 'i-bx-wallet-alt',
    click: () => {
      stateEditSpend.value.spend = JSON.parse(JSON.stringify(userData.value.spend))
      stateEditSpend.value._id = userData.value._id
      modal.value.editSpend = true
    }
  }],
  [{
    label: 'Gửi vật phẩm',
    icon: 'i-bx-mail-send',
    click: () => {
      stateSendItem.value.user = userData.value._id
      modal.value.sendItem = true
    }
  }]
]

const editAuthAction = async () => {
  try {
    loading.value.editAuth = true
    await useAPI('user/admin/editAuth', JSON.parse(JSON.stringify(stateEditAuth.value)))

    loading.value.editAuth = false
    modal.value.editAuth = false
  }
  catch (e) {
    loading.value.editAuth = false
  }
}

const editCurrencyAction = async () => {
  try {
    loading.value.editCurrency = true
    await useAPI('user/admin/editCurrency', JSON.parse(JSON.stringify(stateEditCurrency.value)))

    loading.value.editCurrency = false
    modal.value.editCurrency = false
  }
  catch (e) {
    loading.value.editCurrency = false
  }
}

const editPayAction = async () => {
  try {
    loading.value.editPay = true
    await useAPI('user/admin/editPay', JSON.parse(JSON.stringify(stateEditPay.value)))

    loading.value.editPay = false
    modal.value.editPay = false
  }
  catch (e) {
    loading.value.editPay = false
  }
}

const editSpendAction = async () => {
  try {
    loading.value.editSpend = true
    await useAPI('user/admin/editSpend', JSON.parse(JSON.stringify(stateEditSpend.value)))

    loading.value.editSpend = false
    modal.value.editSpend = false
  }
  catch (e) {
    loading.value.editSpend = false
  }
}
</script>