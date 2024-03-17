<template>
  <UiContent title="User" sub="Quản lý tài khoản người dùng">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>
      <UForm :state="page" @submit="getList" class="mr-1">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'PHONE', 'MAIL', 'IP']" />
        </UiFlex>
      </UForm>

      <UButton class="ml-auto" :loading="loading.exportExcel" @click="exportExcel">Xuất Excel</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #username-data="{ row }">
          <UBadge variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row._id)">
            {{ row.username }}
          </UBadge>
        </template>

        <template #level-data="{ row }">
          <UBadge color="primary" variant="soft">{{ `Cấp ${row.level || 0}` }}</UBadge>
        </template>
        
        <template #pay-data="{ row }">
          {{ toMoney(row.pay || 0) }}
        </template>

        <template #spend-data="{ row }">
          {{ toMoney(row.spend || 0) }}
        </template>

        <template #coin-data="{ row }">
          {{ toMoney(row.coin || 0) }}
        </template>

        <template #wheel-data="{ row }">
          {{ toMoney(row.wheel || 0) }}
        </template>

        <template #login-data="{ row }">
          {{ `${row.login || 0} ngày` }}
        </template>

        <template #ip-data="{ row }">
          {{ row.ip || '...' }}
        </template>

        <template #block-data="{ row }">
          <UBadge :color="row.block == 1 ? 'red' : 'gray'" variant="soft">{{ row.block == 1 ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #type-data="{ row }">
          <UBadge :color="typeFormat[row.type].color" variant="soft">
            {{ typeFormat[row.type].label }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <AdminUserInfo :user="stateUser" />
    </UModal>

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

    <!-- Modal Edit Login-->
    <UModal v-model="modal.editLogin" preventClose>
      <UForm :state="stateEditLogin" @submit="editLoginAction" class="p-4" v-if="stateEditLogin.login">
        <UFormGroup label="Tháng">
          <UInput v-model="stateEditLogin.login.month" type="number" />
        </UFormGroup>

        <UFormGroup label="Tổng">
          <UInput v-model="stateEditLogin.login.total" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editLogin">Sửa dữ liệu đăng nhập</UButton>
          <UButton color="gray" @click="modal.editLogin = false" :disabled="loading.editLogin" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Send Item-->
    <UModal v-model="modal.sendItem" preventClose :ui="{width: 'sm:max-w-[800px]'}">
      <AdminGameSend class="p-4" :user="stateSendItem.user" @close="modal.sendItem = false" />
    </UModal>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'username',
    label: 'Tên',
  },{
    key: 'level',
    label: 'Cấp độ',
    sortable: true
  },{
    key: 'pay',
    label: 'Tổng nạp',
    sortable: true
  },{
    key: 'spend',
    label: 'Tổng tiêu',
    sortable: true
  },{
    key: 'coin',
    label: 'Xu',
    sortable: true
  },{
    key: 'wheel',
    label: 'Lượt quay',
    sortable: true
  },{
    key: 'login',
    label: 'Đăng nhập',
    sortable: true
  },{
    key: 'ip',
    label: 'IP',
  },{
    key: 'block',
    label: 'Khóa',
    sortable: true
  },{
    key: 'type',
    label: 'Quyền',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'USER'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateUser = ref(undefined)

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
    wheel: 0
  },
  origin: {
    coin: null,
    wheel: null
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

const stateEditLogin = ref({
  _id: null,
  login: null
})

const stateEditWheel = ref({
  _id: null,
  wheel: null
})

const stateSendItem = ref({
  user: null
})


// Modal
const modal = ref({
  user: false,
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editSpend: false,
  editLogin: false,
  editWheel: false,
  sendItem: false
})

watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
  type: null,
  plus: {
    coin: 0,
    wheel: 0
  },
  origin: {
    coin: null,
    wheel: null
  },
  reason: null
}))

watch(() => modal.value.editPay, (val) => !val && (stateEditPay.value.reason = null))
watch(() => modal.value.editSpend, (val) => !val && (stateEditSpend.value.reason = null))

// Loading
const loading = ref({
  load: true,
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editSpend: false,
  editLogin: false,
  editWheel: false,
  exportExcel: false
})

// Type
const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
      modal.value.editAuth = true
    }
  }],[{
    label: 'Thêm tiền tệ',
    icon: 'i-bx-coin-stack',
    click: () => {
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'plus'
      modal.value.editCurrency = true
    }
  },{
    label: 'Sửa tiền tệ',
    icon: 'i-bx-coin',
    click: () => {
      Object.keys(stateEditCurrency.value.origin).forEach(key => stateEditCurrency.value.origin[key] = row[key])
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'origin'
      modal.value.editCurrency = true
    }
  }],[{
    label: 'Sửa tích nạp',
    icon: 'i-bx-wallet',
    click: () => {
      stateEditPay.value.pay = JSON.parse(JSON.stringify(row.pay_data))
      stateEditPay.value._id = row._id
      modal.value.editPay = true
    }
  },{
    label: 'Sửa tiêu phí',
    icon: 'i-bx-wallet-alt',
    click: () => {
      stateEditSpend.value.spend = JSON.parse(JSON.stringify(row.spend_data))
      stateEditSpend.value._id = row._id
      modal.value.editSpend = true
    }
  }],
  [{
    label: 'Gửi vật phẩm',
    icon: 'i-bx-mail-send',
    click: () => {
      stateSendItem.value.user = row._id
      modal.value.sendItem = true
    }
  }],
  [{
    label: 'Sửa đăng nhập',
    icon: 'i-bx-calendar',
    click: () => {
      stateEditLogin.value.login = JSON.parse(JSON.stringify(row.login_data))
      stateEditLogin.value._id = row._id
      modal.value.editLogin = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/admin/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editAuthAction = async () => {
  try {
    loading.value.editAuth = true
    await useAPI('user/admin/editAuth', JSON.parse(JSON.stringify(stateEditAuth.value)))

    loading.value.editAuth = false
    modal.value.editAuth = false
    getList()
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
    getList()
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
    getList()
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
    getList()
  }
  catch (e) {
    loading.value.editSpend = false
  }
}

const editLoginAction = async () => {
  try {
    loading.value.editLogin = true
    await useAPI('user/admin/editLogin', JSON.parse(JSON.stringify(stateEditLogin.value)))

    loading.value.editLogin = false
    modal.value.editLogin = false
    getList()
  }
  catch (e) {
    loading.value.editLogin = false
  }
}

const exportExcel = async () => {
  try {
    loading.value.exportExcel = true
    const url = await useAPI('user/admin/exportExcel')

    window.open(url, '_blank')

    loading.value.exportExcel = false
    modal.value.exportExcel = false
  }
  catch (e) {
    loading.value.exportExcel = false
  }
}

getList()
</script>
