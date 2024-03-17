<template>
  <UiContent title="Rank Gift" sub="Quản lý quà xếp hạng">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <USelectMenu 
        v-model="page.type" 
        value-attribute="value"
        option-attribute="label"
        :options="[
          { label: 'Cấp độ', value: 'level' },
          { label: 'Lực chiến', value: 'power' },
        ]"
        class="mr-1"
      >
        <template #label>
          <span>{{ page.type == 'level' ? 'Cấp độ' : 'Lực chiến' }}</span>
        </template>
      </USelectMenu>
      <SelectGameServer v-model="page.server" size="sm" class="mr-auto" />

      <UButton color="gray" @click="modal.add = true" :disabled="!page.server">Thêm</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #expired-data="{ row }">
          {{ !!row.expired ? useDayJs().displayFull(row.expired) : '...' }}
        </template>

        <template #gift-data="{ row }">
          <DataItemList :items="row.gift" class="min-w-[400px] max-w-[400px]" />
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
      <USelectMenu v-model="selectedColumns"  :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5"/>
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" prevent-close :ui="{width: 'sm:max-w-[950px]'}">
      <UForm :state="stateAdd" :validate="validate" @submit="addAction" class="p-4">
        <UFormGroup label="Hạng bắt đầu">
          <UInput v-model="stateAdd.start" type="number" />
        </UFormGroup>

        <UFormGroup label="Hạng kết thúc">
          <UInput v-model="stateAdd.end" type="number" />
        </UFormGroup>
        
        <UFormGroup label="Thời gian có thể nhận">
          <SelectDate v-model="stateAdd.expired" time />
        </UFormGroup>

        <UFormGroup name="gift">
          <SelectItemList v-model="stateAdd.gift" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Tạo</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" prevent-close :ui="{width: 'sm:max-w-[950px]'}">
      <UForm :state="stateEdit" :validate="validate" @submit="editAction" class="p-4">
        <UFormGroup label="Thời gian có thể nhận">
          <SelectDate v-model="stateEdit.expired" time />
        </UFormGroup>

        <UFormGroup name="gift">
          <SelectItemList v-model="stateEdit.gift" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Lưu</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
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
    key: 'start',
    label: 'Hạng bắt đầu',
  },{
    key: 'end',
    label: 'Hạng kết thúc',
  },{
    key: 'expired',
    label: 'Ngày nhận'
  },{
    key: 'gift',
    label: 'Phần thưởng',
  },{
    key: 'actions',
    label: 'Chức năng'
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  server: null,
  type: 'level',
  size: 10,
  current: 1,
  sort: {
    column: 'start',
    direction: 'asc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.server, () => getList())

// State
const stateAdd = ref({
  type: null,
  server: null,
  start: null,
  end: null,
  expired: null,
  gift: [],
})

const stateEdit = ref({
  _id: null,
  expired: null,
  gift: null
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: null,
  server: null,
  start: null,
  end: null,
  expired: stateAdd.value.expired,
  gift: [],
}))

// Loading
const loading = ref({
  load: false,
  add: false,
  edit: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-gift',
    click: () => {
      stateEdit.value._id = row._id
      stateEdit.value.expired = row.expired
      stateEdit.value.gift = JSON.parse((JSON.stringify(row.gift)))
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa mốc',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/admin/rank/listGift', JSON.parse(JSON.stringify(page.value)))

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
    stateAdd.value.server = page.value.server
    stateAdd.value.type = page.value.type
    await useAPI('game/admin/rank/addGift', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/admin/rank/editGift', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('game/admin/rank/delGift', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}
</script>
