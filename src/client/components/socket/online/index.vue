<template>
  <UiFlex class="p-3" justify="between">
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }" :ui="{ item: { shortcuts: 'inline-flex' }}">
      <UButtonGroup>
        <UButton icon="i-bx-group" />
        <UButton color="gray">Online</UButton>
        <UButton color="gray" class="px-3">{{onlineTotal}}</UButton>
      </UButtonGroup>
    </UDropdown>
    
    <UiIcon name="i-bx-x" size="5" pointer @click="emit('close')" />

    <UModal v-model="modal.view">
      <SocketOnlineView :type="stateView.type" @close="modal.view = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const socketStore = useSocketStore()
const emit = defineEmits(['close'])

const modal = ref({
  view: false
})

const stateView = ref({
  type: null
})

const items = computed(() => [[
  {
    label: 'Khách',
    shortcuts: [socketStore.online.guest],
  },{
    label: 'Thành viên',
    shortcuts: [socketStore.online.member],
    click: () => {
      stateView.value.type = 'member'
      modal.value.view = true
    }
  },{
    label: 'Quản trị viên',
    shortcuts: [socketStore.online.admin],
    click: () => {
      stateView.value.type = 'admin'
      modal.value.view = true
    }
  }
]])

const onlineTotal = computed(() => socketStore.online.guest + socketStore.online.member + socketStore.online.admin)
</script>