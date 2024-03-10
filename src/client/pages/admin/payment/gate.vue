<template>
  <UiContent title="Gate" sub="Quản lý các kênh nạp">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>

    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #type-data="{ row }">
          <UBadge variant="soft">{{ typeFormat[row.type] }}</UBadge>
        </template>

        <template #payment_money-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.payment_money) }}</UiText>
        </template>

        <template #bonus_default-data="{ row }">
          {{ row.bonus_default }}%
        </template>

        <template #bonus_limit-data="{ row }">
          {{ row.bonus_limit }}%
        </template>

        <template #bonus_limit_expired-data="{ row }">
          {{ !!row.bonus_limit_expired ? useDayJs().displayFull(row.bonus_limit_expired) : '...' }}
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display == 1 ? 'green' : 'gray'" variant="soft">{{ row.display == 1 ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Loại">
          <SelectGateType v-model="stateAdd.type" />
        </UFormGroup>

        <UFormGroup label="Tên kênh">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Số tài khoản">
          <UInput v-model="stateAdd.number" />
        </UFormGroup>

        <UFormGroup label="Người hưởng thụ">
          <UInput v-model="stateAdd.person" />
        </UFormGroup>

        <UFormGroup label="Khuyến mại mặc định">
          <UInput v-model="stateAdd.bonus.default" type="number" />
        </UFormGroup>

        <UFormGroup label="Khuyến mại có hạn">
          <UiFlex class="gap-1">
            <UInput v-model="stateAdd.bonus.limit.number" type="number" placeholder="Tỷ lệ" class="w-full" />
            <SelectDate v-model="stateAdd.bonus.limit.expired" time placeholder="Ngày hết hạn" class="w-full" />
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Loại">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Tên kênh">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <UFormGroup label="Số tài khoản">
          <UInput v-model="stateEdit.number" />
        </UFormGroup>

        <UFormGroup label="Người hưởng thụ">
          <UInput v-model="stateEdit.person" />
        </UFormGroup>

        <UFormGroup label="Khuyến mại mặc định">
          <UInput v-model="stateEdit.bonus.default" type="number" />
        </UFormGroup>

        <UFormGroup label="Khuyến mại có hạn">
          <UiFlex class="gap-1">
            <UInput v-model="stateEdit.bonus.limit.number" type="number" placeholder="Tỷ lệ" class="w-full" />
            <SelectDate v-model="stateEdit.bonus.limit.expired" time placeholder="Ngày hết hạn" class="w-full" />
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Loại">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Extend -->
    <UModal v-model="modal.extend" preventClose>
      <UForm :state="stateExtend" @submit="extendAction" class="p-4">
        <UFormGroup label="Key">
          <UInput v-model="stateExtend.key" />
        </UFormGroup>

        <UFormGroup label="QR Code">
          <UInput v-model="stateExtend.qrcode" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.extend">Lưu</UButton>
          <UButton color="gray" @click="modal.extend = false" :disabled="loading.extend" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
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
    key: 'type',
    label: 'Loại',
    sortable: true
  },{
    key: 'name',
    label: 'Tên kênh',
  },{
    key: 'payment_count',
    label: 'Giao dịch',
  },{
    key: 'payment_money',
    label: 'Tổng nhận',
  },{
    key: 'bonus_default',
    label: 'Khuyến mại mặc định',
    sortable: true
  },{
    key: 'bonus_limit',
    label: 'Khuyến mại có hạn',
    sortable: true
  },{
    key: 'bonus_limit_expired',
    label: 'Hạn khuyến mại',
    sortable: true
  },{
    key: 'display',
    label: 'Hiển thị',
    sortable: true
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
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
    column: 'updatedAt',
    direction: 'desc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  type: null,
  name: null,
  person: null,
  number: null,
  bonus: {
    default: 0,
    limit: {
      number: 0,
      expired: null
    }
  },
  display: 1,
})

const stateEdit = ref({
  _id: null,
  name: null,
  person: null,
  number: null,
  bonus: null,
  display: 1,
})

const stateExtend = ref({
  _id: null,
  qrcode: null,
  key: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  extend: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: null,
  name: null,
  person: null,
  number: null,
  bonus: {
    default: 0,
    limit: {
      number: 0,
      expired: null
    }
  },
  display: 1,
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  extend: false,
  del: false
})

// Type
const typeFormat = {
  1: 'Thẻ cào',
  2: 'Ngân hàng',
  3: 'Momo'
}

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  },{
    label: 'Sửa tiện ích',
    icon: 'i-bx-qr',
    click: () => {
      Object.keys(stateExtend.value).forEach(key => stateExtend.value[key] = row[key])
      modal.value.extend = true
    }
  }],[{
    label: 'Xóa kênh',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('gate/admin/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('gate/admin/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('gate/admin/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const extendAction = async () => {
  try {
    loading.value.extend = true
    await useAPI('gate/admin/extend', JSON.parse(JSON.stringify(stateExtend.value)))

    loading.value.extend = false
    modal.value.extend = false
    getList()
  }
  catch (e) {
    loading.value.extend = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('gate/admin/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
