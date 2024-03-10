<template>
  <div>
    <UiFlex justify="between" class="py-1 px-4 pr-2 bg-primary-700 dark:bg-primary-600 text-white rounded-t-lg">
      <UiText weight="semibold" size="sm" mini>{{ type == 'member' ? 'Thành Viên' : 'Quản Trị Viên' }} Trực Tuyến</UiText>
      <UiIcon name="i-bx-x" size="7" class="ml-4" pointer @click="emits('close')"/>
    </UiFlex>

    <div class="p-2 max-h-[400px] overflow-y-auto">
      <DataEmpty :text="!!loading ? 'Đang tải...' : 'Không có dữ liệu'" icon="i-bxs-user-account" v-if="!!loading || !list || list.length == 0" />

      <UiFlex type="col" class="space-y-2" v-if="!!list && list.length > 0">
        <div class="w-full" v-for="user in list" :key="user._id">
          <UiFlex class="p-2" >
            <UAvatar :src="user.avatar" alt="Avatar" size="sm" class="mr-3"  />

            <UiText class="capitalize mr-auto" weight="semibold" size="sm" mini>{{ user.username }}</UiText>

            <UBadge color="primary" variant="soft" class="ml-2">
              Cấp {{ user.level?.number || 0 }}
            </UBadge>
          </UiFlex>
        </div>
        
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['type'])
const emits = defineEmits(['close'])
const loading = ref(true)
const list = ref(undefined)

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('socket/online/view', {
      type: props.type
    })

    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

getList()
</script>