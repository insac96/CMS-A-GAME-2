<template>
  <UiFlex type="col" items="start" class="w-full max-h-full overflow-hidden">
    <!-- Header -->
    <UiFlex class="p-4 w-full">
      <USelectMenu
        v-model="type"
        :options="typeSelectList"
        value-attribute="value"
        option-attribute="label"
        class="w-32"
      >
        <template #label>{{typeSelect.label}}</template>
      </USelectMenu>

      <USelectMenu v-model="page.size" :options="[5,10,15,20]" class="ml-1 mr-auto"/>

      <UDropdown :items="menuList">
        <UButton color="white" icon="i-bx-dots-horizontal-rounded" :loading="deleting"/>
      </UDropdown>
    </UiFlex>

    <!-- Body -->
    <div class="px-4 grow overflow-y-auto w-full max-h-full">
      <LoadingUserNotifies v-if="loading" />

      <div v-else>
        <DataNotifyUserList :source="list" @to="emit('close')" />
      </div>
    </div>

    <!-- Footer -->
    <UiFlex justify="end" class="p-4 w-full">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>

    <!--Modal Send-->
    <UModal v-model="modalSend" prevent-close>
      <DataNotifyUserSend @done="modalSend = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
// Main
const emit = defineEmits(['close'])
const loading = ref(true)
const deleting = ref(false)
const list = ref(undefined)
const type = ref(undefined)
const page = ref({
  size: 5,
  current: 1,
  total: 0,
  sort: {
    by: 'createdAt',
    index: -1
  }
})
const modalSend = ref(false)

// Select Type
const typeSelectList = [
  { label: 'Tất cả', value: undefined },
  { label: 'Mặc định', value: 0 },
  { label: 'Tin tức', value: 1 },
  { label: 'Riêng tư', value: 2 },
  { label: 'Hệ thống', value: 3 },
]
const typeSelect = computed(() => typeSelectList.find(i => i.value === type.value))

// Menu 
const menuList = [[
  { label: 'Mới nhất', icon: 'i-bx-down-arrow-alt', click: () => page.value.sort.index = -1 },
  { label: 'Cũ nhất', icon: 'i-bx-up-arrow-alt', click: () => page.value.sort.index = 1 }
], [
  { label: 'Gửi thông báo', icon: 'i-bx-mail-send', click: () => modalSend.value = true}
], [
  { label: 'Xóa tất cả', icon: 'i-bx-trash', click: () => delAll() }
]]

// Watch 
watch(type, () => getList())
watch(
  () => page.value.size,
  () => getList()
)
watch(
  () => page.value.current,
  () => getList()
)
watch(
  () => page.value.sort.index,
  () => getList()
)

// Fetch List
const getList = async () => {
  try {
    loading.value = true
    const { list: listResult, page: pageResult } = await useAPI('notify/user/auth/list', {
      type: type.value,
      page: JSON.parse(JSON.stringify(page.value))
    })

    page.value.total = pageResult.total
    list.value = listResult
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

// Fetch Del
const delAll = async () => {
  try {
    if(deleting.value == true) return
    deleting.value = true

    await useAPI('notify/user/auth/del')
    deleting.value = false

    if(page.value.current == 1) return getList()
    page.value.current = 1
  }
  catch (e) {
    deleting.value = false
  }
}

getList()
</script>