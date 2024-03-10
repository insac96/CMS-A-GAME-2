<template>
  <UiContent title="Chats" sub="Lịch sử tin nhắn thế giới">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <UForm :state="page" @submit="getList" class="mr-auto">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'TEXT']" />
        </UiFlex>
      </UForm>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #user-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
        </template>

        <template #text-data="{ row }">
          <div class="whitespace-normal" v-html="row.text" />
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
        
        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <AdminUserInfo :user="stateUser" />
    </UModal>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'text',
    label: 'Tin nhắn',
  },{
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
  },{
    key: 'actions',
    label: 'Hành động'
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
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true,
  del: false
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

const actions = (row) => [
  [{
    label: 'Xóa tin nhắn',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('socket/admin/chat/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('socket/admin/chat/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
