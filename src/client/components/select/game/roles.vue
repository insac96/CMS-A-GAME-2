<template>
  <UCard :ui="{ 
    body: { padding: 'p-0 sm:p-0' },
    header: { padding: 'p-2 sm:p-2' },
  }">
    <template #header>
      <UiFlex justify="end">
        <UButton color="gray" @click="modal.add = true">Thêm nhân vật</UButton>
      </UiFlex>
    </template>

    <UTable :columns="columns" :rows="list">
      <template #user-data="{ row }">
        <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
      </template>

      <template #server-data="{ row }">
        <UiText weight="semibold">{{ row.server.server_name }}</UiText>
      </template>

      <template #role-data="{ row }">
        <UiText weight="semibold">{{ row.role.role_name }}</UiText>
      </template>

      <template #actions-data="{ row, index }">
        <UButton icon="i-bx-trash" color="red" @click="delAction(index)" />
      </template>
    </UTable>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <AdminUserInfo :user="stateUser" />
    </UModal>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="p-4">
        <UFormGroup label="Tài khoản" name="user">
          <SelectUser v-model="state.user" v-model:user-data="stateAdd.user" />
        </UFormGroup>

        <UFormGroup label="Máy chủ" name="server">
          <SelectGameServer v-model="state.server" v-model:server-data="stateAdd.server" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" name="role" v-if="!!state.server && !!state.user">
          <SelectGameRole v-model="state.role" v-model:role-data="stateAdd.role" :server="state.server" :user="state.user" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const toast = useToast()
const props = defineProps({
  modelValue: Array,
})
const emit = defineEmits(['update:modelValue'])

const list = ref(props.modelValue || [])

const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'role',
    label: 'Nhân vật'
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]

const state = ref({
  user: null,
  server: null,
  role: null
})

const stateAdd = ref({
  user: null,
  server: null,
  role: null
})

const stateUser = ref(undefined)

const modal = ref({
  add: false,
  user: false
})

watch(() => modal.value.add, (val) => {
  if(!val){
    stateAdd.value = {
      user: null,
      server: null,
      role: null
    }
    state.value = {
      user: null,
      server: null,
      role: null
    }
  }
})

const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

const showError = (text) => {
  toast.add({
    title: 'Lỗi',
    description: text,
    icon: 'i-bx-error',
    color: 'red'
  })
}

const addAction = () => {
  try {
    if(!stateAdd.value.user || !stateAdd.value.server || !stateAdd.value.role) throw 'Vui lòng chọn đầy đủ'

    const data = JSON.parse(JSON.stringify(stateAdd.value))
    const user = data.user._id
    const server = data.server.server_id
    const role = data.role.role_id

    const check = list.value.find(i => (i.user._id === user) && (i.server.server_id === server) && (i.role.role_id === role))
    if(!!check) throw 'Nhân vật đã tồn tại'

    list.value.push(data)

    emit('update:modelValue', list.value)
    modal.value.add = false
  }
  catch (e) {
    showError(e.toString())
  }
}

const delAction = (index) => {
  try {
    if(!list.value[index]) throw 'Chỉ mục vật phẩm sai'
    list.value.splice(index, 1)

    emit('update:modelValue', list.value)
  }
  catch (e) {
    showError(e.toString())
  }
}
</script>