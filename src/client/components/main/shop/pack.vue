<template>
  <div>
    <!-- Match -->
    <UiFlex justify="between" class="mb-3">
      <UForm :state="page" @submit="getList" class="mr-1 max-w-[150px] sm:max-w-[220px]">
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
      <DataEmpty icon="i-bx-shopping-bag" text="Không có gói nào đang bày bán" v-if="list.length == 0"></DataEmpty>

      <div class="grid grid-cols-12 gap-2" v-if="list.length > 0">
        <DataShopPack
          class="xl:col-span-3 sm:col-span-4 col-span-6" 
          v-for="pack in list" :key="pack._id"
          :pack="pack"
          :config="config"
          :max="2"
          @click="buyPack(pack)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <UiFlex justify="end" class="mt-6" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>

    <!-- Buy -->
    <UModal v-model="modal.buy" prevent-close v-if="authStore.isLogin">
      <DataShopBuyPack :pack="packSelect" @close="modal.buy = false" class="p-4"/>
    </UModal>

    <!-- Limit -->
    <UModal v-model="modal.limit" v-if="authStore.isLogin">
      <DataShopLimit auth />
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
})
watch(() => page.value.sort, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const packSelect = ref(undefined)
watch(() => modal.value.buy, (val) => (!val && (packSelect.value = undefined)))

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

const buyPack = (pack) => {
  const toast = useToast()
  if(!authStore.isLogin) return toast.add({
    title: 'Xác thực',
    description: 'Vui lòng đăng nhập trước',
    icon: 'i-bx-shield-quarter',
    color: 'red'
  })

  packSelect.value = pack
  modal.value.buy = true
}

const getList = async () => {
  try {
    loading.value = true

    const configData = await useAPI('shop/config')
    config.value = Object.assign(config.value, configData)

    const listData = await useAPI('shop/pack/list', JSON.parse(JSON.stringify(page.value)))

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