<template>
  <div>
    <!-- Match -->
    <UiFlex justify="between" class="mb-3">
      <UForm :state="page" @submit="getList" class="mr-1">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      
      <UDropdown :items="menuList">
        <UButton icon="i-bx-dots-vertical-rounded" color="white" size="sm"></UButton>
      </UDropdown>
    </UiFlex>

    <!-- Loading -->
    <div class="grid grid-cols-12 gap-2" v-if="!!loading">
      <LoadingShopBox class="xl:col-span-3 sm:col-span-4 col-span-6"/>
      <LoadingShopBox class="xl:col-span-3 sm:col-span-4 col-span-6"/>
      <LoadingShopBox class="xl:col-span-3 sm:col-span-4 col-span-6"/>
      <LoadingShopBox class="xl:col-span-3 sm:col-span-4 col-span-6 sm:hidden xl:block"/>
    </div>

    <!-- Main -->
    <div v-else>
      <DataEmpty icon="i-bx-shopping-bag" text="Không có vật phẩm nào đang bày bán" v-if="list.length == 0"></DataEmpty>

      <div class="grid grid-cols-12 gap-2" v-if="list.length > 0">
        <DataShopBox
          class="xl:col-span-3 sm:col-span-4 col-span-6" 
          v-for="item in list" :key="item._id"
          :item="item"
          :config="config"
          @click="buyItem(item)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <UiFlex justify="end" class="mt-6" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>

    <!-- Buy -->
    <UModal v-model="modal.buy" prevent-close v-if="authStore.isLogin">
      <DataShopBuyItem :item="itemSelect" @close="modal.buy = false" class="p-4"/>
    </UModal>

  </div>
</template>

<script setup>
const authStore = useAuthStore()

const config = ref({
  maintenance: true,
  discount: {
    number: null,
    expired: null
  }
})
const list = ref([])

const loading = ref(true)
const modal = ref({
  limit: false,
  buy: false
})

const page = ref({
  size: 12,
  current: 1,
  sort: {
    direction: 'desc',
    column: 'price'
  },
  search: undefined,
  total: 0,
  types: ['game_item'],
})
watch(() => page.value.sort, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.types, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const itemSelect = ref(undefined)
watch(() => modal.value.buy, (val) => (!val && (itemSelect.value = undefined)))

const typeSelect = ref('game_item')
watch(() => typeSelect.value, (val) => page.value.types = [val])

const menuList = computed(() => [
  [{
    label: 'Giá giảm dần', 
    icon: 'i-bx-sort-down', 
    click: () => page.value.sort = { direction: 'desc', column: 'price' }
  },{ 
    label: 'Giá tăng dần', 
    icon: 'i-bx-sort-up', 
    click: () => page.value.sort = { direction: 'asc', column: 'price' }
  }]
])

const buyItem = (item) => {
  const toast = useToast()
  if(!authStore.isLogin) return toast.add({
    title: 'Xác thực',
    description: 'Vui lòng đăng nhập trước',
    icon: 'i-bx-shield-quarter',
    color: 'red'
  })

  itemSelect.value = item
  modal.value.buy = true
}

const getList = async () => {
  try {
    loading.value = true

    const configData = await useAPI('shop/config')
    config.value = Object.assign(config.value, configData)

    const listData = await useAPI('shop/list', JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    page.value.total = listData.total
    list.value = listData.list
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getList()
</script>