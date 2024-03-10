<template>
  <UiContent title="Level" sub="Quản lý cấp độ tài khoản">
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
        <template #number-data="{ row }">
          <UBadge color="primary" variant="soft">{{ `Cấp ${row.number}` }}</UBadge>
        </template>

        <template #bonus-data="{ row }">
          {{ row.bonus }}%
        </template>

        <template #bonus_wheel-data="{ row }">
          {{ useMoney().toMoney(row.bonus_wheel) }}đ / 1 vòng
        </template>

        <template #discount-data="{ row }">
          {{ row.discount }}%
        </template>

        <template #bonus_presentee_pay-data="{ row }">
          {{ row.bonus_presentee_pay }}%
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
        <UFormGroup label="Cấp độ">
          <UInput v-model="stateAdd.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng xu (%)">
          <UInput v-model="stateAdd.bonus" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng vòng quay (VNĐ)">
          <UInput v-model="stateAdd.bonus_wheel" type="number" />
        </UFormGroup>

        <UFormGroup label="Giảm giá cửa hàng (%)">
          <UInput v-model="stateAdd.discount" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn bè nạp thưởng cống hiến (%)">
          <UInput v-model="stateAdd.bonus_presentee_pay" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="p-4">
        <UFormGroup label="Cấp độ">
          <UInput v-model="stateEditInfo.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng xu (%)">
          <UInput v-model="stateEditInfo.bonus" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng vòng quay (VNĐ)">
          <UInput v-model="stateEditInfo.bonus_wheel" type="number" />
        </UFormGroup>

        <UFormGroup label="Giảm giá cửa hàng (%)">
          <UInput v-model="stateEditInfo.discount" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn bè nạp thưởng cống hiến (%)">
          <UInput v-model="stateEditInfo.bonus_presentee_pay" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editInfo">Sửa</UButton>
          <UButton color="gray" @click="modal.editInfo = false" :disabled="loading.editInfo" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Need -->
    <UModal v-model="modal.editNeed" preventClose>
      <UForm :state="stateEditNeed" @submit="editNeedAction" class="p-4">
        <AdminLevelEditNeed v-model:need="stateEditNeed.need" />

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editNeed">Sửa</UButton>
          <UButton color="gray" @click="modal.editNeed = false" :disabled="loading.editNeed" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Limit -->
    <UModal v-model="modal.editLimit" preventClose>
      <UForm :state="stateEditLimit" @submit="editLimitAction" class="p-4">
        <AdminLevelEditLimit v-model:limit="stateEditLimit.limit" />

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editLimit">Sửa</UButton>
          <UButton color="gray" @click="modal.editLimit = false" :disabled="loading.editLimit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

     <!-- Modal Edit Gift Invited -->
     <UModal v-model="modal.editGiftInvited" preventClose>
      <UForm :state="stateEditGiftInvited" @submit="editGiftInvitedAction" class="p-4">
        <SelectItemList v-model="stateEditGiftInvited.gift_invited" :types="['coin', 'wheel', 'notify', 'game_item']" />

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editGiftInvited">Sửa</UButton>
          <UButton color="gray" @click="modal.editGiftInvited = false" :disabled="loading.editGiftInvited" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'number',
    label: 'Cấp độ',
    sortable: true
  },{
    key: 'bonus',
    label: 'Nạp thưởng xu',
    sortable: true
  },{
    key: 'bonus_wheel',
    label: 'Nạp thưởng vòng quay',
    sortable: true
  },{
    key: 'discount',
    label: 'Giảm giá cửa hàng',
    sortable: true
  },{
    key: 'bonus_presentee_pay',
    label: 'Bạn bè nạp thưởng CH',
    sortable: true
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
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
    column: 'number',
    direction: 'asc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  number: null,
  bonus: 0,
  bonus_wheel: 0,
  bonus_presentee_pay: 0,
  discount: 0,
})

const stateEditInfo = ref({
  _id: null,
  number: null,
  bonus: null,
  bonus_wheel: null,
  bonus_presentee_pay: null,
  discount: null
})

const stateEditNeed = ref({
  _id: null,
  need: null
})

const stateEditLimit = ref({
  _id: null,
  limit: null
})

const stateEditGiftInvited = ref({
  _id: null,
  gift_invited: null
})

// Modal
const modal = ref({
  add: false,
  editInfo: false,
  editNeed: false,
  editLimit: false,
  editGiftInvited: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  number: null,
  bonus: 0,
  bonus_wheel: 0,
  bonus_presentee_pay: 0,
  discount: 0,
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  editInfo: false,
  editNeed: false,
  editLimit: false,
  del: false,
  editGiftInvited: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditInfo.value).forEach(key => stateEditInfo.value[key] = row[key])
      modal.value.editInfo = true
    }
  }],[{
    label: 'Sửa yêu cầu',
    icon: 'i-bx-lock-open',
    disabled: row.number == 1,
    click: () => {
      Object.keys(stateEditNeed.value).forEach(key => stateEditNeed.value[key] = row[key])
      modal.value.editNeed = true
    }
  },{
    label: 'Sửa giới hạn',
    icon: 'i-bx-lock-alt',
    click: () => {
      Object.keys(stateEditLimit.value).forEach(key => stateEditLimit.value[key] = row[key])
      modal.value.editLimit = true
    }
  }],[{
    label: 'Sửa quà cho bạn bè',
    icon: 'i-bx-gift',
    click: () => {
      stateEditGiftInvited.value._id = row._id
      stateEditGiftInvited.value.gift_invited = JSON.parse((JSON.stringify(row.gift_invited)))
      modal.value.editGiftInvited = true
    }
  }],[{
    label: 'Xóa cấp độ',
    icon: 'i-bx-trash',
    disabled: row.number == 1,
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('level/admin/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('level/admin/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editInfoAction = async () => {
  try {
    loading.value.editInfo = true
    await useAPI('level/admin/editInfo', JSON.parse(JSON.stringify(stateEditInfo.value)))

    loading.value.editInfo = false
    modal.value.editInfo = false
    getList()
  }
  catch (e) {
    loading.value.editInfo = false
  }
}

const editNeedAction = async () => {
  try {
    loading.value.editNeed = true
    await useAPI('level/admin/editNeed', JSON.parse(JSON.stringify(stateEditNeed.value)))

    loading.value.editNeed = false
    modal.value.editNeed = false
    getList()
  }
  catch (e) {
    loading.value.editNeed = false
  }
}

const editLimitAction = async () => {
  try {
    loading.value.editLimit = true
    await useAPI('level/admin/editLimit', JSON.parse(JSON.stringify(stateEditLimit.value)))

    loading.value.editLimit = false
    modal.value.editLimit = false
    getList()
  }
  catch (e) {
    loading.value.editLimit = false
  }
}

const editGiftInvitedAction = async () => {
  try {
    loading.value.editGiftInvited = true
    await useAPI('level/admin/editGiftInvited', JSON.parse(JSON.stringify(stateEditGiftInvited.value)))

    loading.value.editGiftInvited = false
    modal.value.editGiftInvited = false
    getList()
  }
  catch (e) {
    loading.value.editGiftInvited = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('level/admin/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
