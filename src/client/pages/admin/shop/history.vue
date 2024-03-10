<template>
  <UiContent title="History Shop" sub="Lịch sử mua toàn hệ thống">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <UForm :state="page" @submit="getList">
        <UInput size="sm" v-model="page.user" placeholder="Tìm kiếm theo tài khoản" />
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

        <template #item-data="{ row }">
          <DataItem :item="{
            name: row.item.item_name,
            image: row.item.item_image,
            type: row.item.type
          }"/>
        </template>

        <template #server-data="{ row }">
          <UBadge color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #amount-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.amount) }}</UiText>
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
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
    key: 'item',
    label: 'Mặt hàng',
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'amount',
    label: 'Số lượng',
    sortable: true
  },{
    key: 'price',
    label: 'Giá mua',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày mua',
    sortable: true
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
  user: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.user, (val) => !val && getList())

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('shop/admin/history', JSON.parse(JSON.stringify(page.value)))

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
