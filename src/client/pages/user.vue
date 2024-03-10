<template>
  <div class="max-w-[700px] mx-auto">
    <UiContent title="Profile" sub="Thông tin tài khoản" class="mb-6">
      <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }}">
        <DataUserBox :fetch-id="authStore.profile._id" :reload="reload">
          <template #more>
            <UDropdown :items="menu">
              <UButton color="gray" variant="ghost" icon="i-bx-chevron-down" />
            </UDropdown>
          </template>
        </DataUserBox>
      </UCard>
    </UiContent>

    <UiContent title="Statistic" sub="Thống kê số liệu" class="mb-6">
      <DataUserStatistical />
    </UiContent>

    <UiContent title="Payment" sub="Lịch sử nạp tiền" class="mb-6">
      <DataPaymentHistory />
    </UiContent>

    <UiContent title="Withdraw" sub="Lịch sử đổi xu" class="mb-6">
      <DataWithdrawHistory />
    </UiContent>

    <UiContent title="Shop" sub="Lịch sử mua hàng" class="mb-6">
      <DataShopHistory />
    </UiContent>

    <UiContent title="Event" sub="Lịch sử nhận sự kiện">
      <DataEventHistory />
    </UiContent>

    <UModal v-model="modal.password">
      <AuthUpdatePassword @done="modal.password = false" />
    </UModal>

    <UModal v-model="modal.avatar">
      <AuthUpdateAvatar @done="modal.avatar = false, reload++" />
    </UModal>
  </div>
</template>

<script setup>
useSeoMeta({
  title: () => `Tài khoản`,
  robots: 'none'
})

definePageMeta({
  middleware: 'user'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && useTo().navigateToSSL('/'))

const modal = ref({
  avatar: false,
  password: false
})

const reload = ref(0)

const menu = [
  [{ 
    label: 'Ảnh đại diện', 
    icon: 'i-bx-user-circle',
    click: () => modal.value.avatar = true
  },{ 
    label: 'Đổi mật khẩu', 
    icon: 'i-bx-lock',
    click: () => modal.value.password = true
  }],[{ 
    label: 'Đăng xuất', 
    icon: 'i-bx-log-out', 
    click: () => signOut()
  }]
]


const signOut = async () => {
  await useAPI('auth/sign/out')
  authStore.removeAuth()
}
</script>