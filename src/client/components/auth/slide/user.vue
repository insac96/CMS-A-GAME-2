<template>
  <DataUserBox :fetch-id="authStore.profile._id" no-auth @action="emit('close')">
    <template #more>
      <UiFlex>
        <UButton icon="i-bx-user" color="gray" variant="ghost" class="mr-1" @click="useTo().navigateToSSL('/main/user'), emit('close')"></UButton>
        <UButton icon="i-bx-power-off" color="red" @click="signOut"></UButton>
      </UiFlex>
    </template>
  </DataUserBox>
</template>

<script setup>
const authStore = useAuthStore()
const emit = defineEmits(['close'])

const signOut = async () => {
  await useAPI('auth/sign/out')
  emit('close')
  authStore.removeAuth()
}

</script>