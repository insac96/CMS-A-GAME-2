<template>
  <UiContent title="Config Event" sub="Quản lý cấu hình sự kiện">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #start-data="{ row }">
          {{ row.start ? useDayJs().displayFull(row.start) : '...' }}
        </template>

        <template #end-data="{ row }">
          {{ row.end ? useDayJs().displayFull(row.end) : '...' }}
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

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Bắt đầu">
          <SelectDate v-model="stateEdit.start" time />
        </UFormGroup>

        <UFormGroup label="Kết thúc">
          <SelectDate v-model="stateEdit.end" time />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Del -->
    <UModal v-model="modal.del" preventClose>
      <UForm :state="stateDel" @submit="delAction" class="p-4">
        <UFormGroup label="Thời gian bắt đầu">
          <SelectDate v-model="stateDel.start" time />
        </UFormGroup>

        <UFormGroup label="Thời gian kết thúc">
          <SelectDate v-model="stateDel.end" time />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.del">Xóa Ghi Chép</UButton>
          <UButton color="gray" @click="modal.del = false" :disabled="loading.del" class="ml-1">Đóng</UButton>
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
    key: 'name',
    label: 'Tên sự kiện',
  },{
    key: 'start',
    label: 'Bắt đầu',
    sortable: true
  },{
    key: 'end',
    label: 'Kết thúc',
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
const stateEdit = ref({
  _id: null,
  start: null,
  end: null,
  display: null
})

const stateDel = ref({
  _id: null,
  start: null,
  end: null
})

// Modal
const modal = ref({
  edit: false,
  del: false
})

// Loading
const loading = ref({
  load: true,
  edit: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa ghi chép',
    icon: 'i-bx-trash',
    click: () => {
      stateDel.value._id = row._id
      modal.value.del = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/admin/config/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('event/admin/config/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async () => {
  try {
    loading.value.del = true
    await useAPI('event/admin/config/del', JSON.parse(JSON.stringify(stateDel.value)))

    loading.value.del = false
    modal.value.del = false
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
