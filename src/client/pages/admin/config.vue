<template>
  <UiContent 
    title="Config" 
    sub="Chỉnh sửa cấu hình trang" 
    class="max-w-3xl mx-auto"
  >
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
          {{ item.label }}
        </UButton>
      </template>

      <template #enable>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Đăng nhập</UiText>
            <UToggle v-model="state.enable.signin" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Đăng ký</UiText>
            <UToggle v-model="state.enable.signup" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Chơi trò chơi</UiText>
            <UToggle v-model="state.enable.play" />
          </UiFlex>
          
          <div class="mb-4">
            <UiFlex justify="between" class="mb-2">
              <UiText weight="semibold">Landing Home</UiText>
              <UToggle v-model="state.enable.landing" />
            </UiFlex>

            <SelectAdsLanding v-model="state.homepage.landing" v-if="!!state.enable.landing" />
          </div>

          <UiFlex justify="end" class="mt-4">
            <UButton @click="update('cfg')" :loading="updating">Cập nhật</UButton>
          </UiFlex>
        </UCard>
      </template>

      <template #basic>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên trang">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.short_name" />
            </UFormGroup>

            <UFormGroup label="Mô tả">
              <UTextarea autoresize v-model="state.description" name="input" />
            </UFormGroup>

            <UFormGroup label="Logo vuông">
              <UiUploadImage v-model="state.logo_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Logo dài">
              <UiUploadImage v-model="state.logo_long_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_long_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Banner">
              <UiUploadImage v-model="state.og_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.og_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Link tải APK">
              <UInput v-model="state.download.apk" />
            </UFormGroup>

            <UFormGroup label="Link tải IOS">
              <UInput v-model="state.download.ios" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('basic')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #social>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Facebook">
              <UInput v-model="state.social.facebook" />
            </UFormGroup>

            <UFormGroup label="Messenger">
              <UInput v-model="state.social.messenger" />
            </UFormGroup>

            <UFormGroup label="Zalo">
              <UInput v-model="state.social.zalo" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('social')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #game>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Secret">
              <UInput v-model="state.game.secret" />
            </UFormGroup>

            <UFormGroup label="Path Image">
              <UInput v-model="state.game.image" />
            </UFormGroup>

            <UFormGroup label="API Get OS">
              <UInput v-model="state.game.api.os" />
            </UFormGroup>
            
            <UFormGroup label="API Get Start">
              <UInput v-model="state.game.api.start" />
            </UFormGroup>

            <UFormGroup label="API Get Server">
              <UInput v-model="state.game.api.server" />
            </UFormGroup>

            <UFormGroup label="API Get Role">
              <UInput v-model="state.game.api.role" />
            </UFormGroup>

            <UFormGroup label="API Get All Role">
              <UInput v-model="state.game.api.roles" />
            </UFormGroup>

            <UFormGroup label="API Rank Level">
              <UInput v-model="state.game.api.rank_level" />
            </UFormGroup>

            <UFormGroup label="API Rank Power">
              <UInput v-model="state.game.api.rank_power" />
            </UFormGroup>

            <UFormGroup label="API Send Mail">
              <UInput v-model="state.game.api.mail" />
            </UFormGroup>

            <UFormGroup label="API Send Recharge">
              <UInput v-model="state.game.api.recharge" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('game')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #facebook>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.facebook.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.facebook.client_secret" />
            </UFormGroup>

            <UFormGroup label="Version">
              <UInput v-model="state.facebook.client_version" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.facebook.client_verify" />
            </UFormGroup>

            <UFormGroup label="Ads">
              <UInput v-model="state.facebook.client_ads" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('facebook')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #google>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.google.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.google.client_secret" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.google.client_verify" />
            </UFormGroup>

            <UFormGroup label="Ads">
              <UInput v-model="state.google.client_ads" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('google')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #tiktok>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.tiktok.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.tiktok.client_secret" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('tiktok')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #zalo>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.zalo.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.zalo.client_secret" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.zalo.client_verify" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('zalo')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  name: '',
  short_name: '',
  description: '',
  og_image: '',
  logo_image: '',
  logo_long_image: '',
  makeby: '',

  enable: {
    signin: true,
    signup: true,
    play: true,
    landing: false
  },

  homepage: {
    landing: null,
  },

  download: {
    apk: '',
    ios: '',
  },

  social: {
    facebook: '',
    messenger: '',
    zalo: ''
  },

  game: {
    image: '',
    secret: '',
    api: {
      start: '',
      server: '',
      role: '',
      roles: '',
      rank_level: '',
      rank_power: '',
      mail: '',
      recharge: '',
      os: ''
    }
  },

  facebook: {
      client_id: '',
      client_secret: '',
      client_version: '',
      client_verify: '',
      client_ads: ''
    },
    google: {
      client_id: '',
      client_secret: '',
      client_verify: '',
      client_ads: ''
    },
    tiktok: {
      client_id: '',
      client_secret: '',
      client_verify: '',
    },
    zalo: {
      client_id: '',
      client_secret: '',
      client_verify: '',
    }
})

const menu = [
{
  label: 'Cho phép',
  slot: 'enable'
},
{
  label: 'Cơ bản',
  slot: 'basic'
},
{
  label: 'Mạng xã hội',
  slot: 'social'
},
{
  label: 'Trò chơi',
  slot: 'game'
},
{
  label: 'Facebook',
  slot: 'facebook'
},
{
  label: 'Google',
  slot: 'google'
},
{
  label: 'Tiktok',
  slot: 'tiktok'
},
{
  label: 'Zalo',
  slot: 'zalo'
}
]

const getConfig = async () => {
  const config = await useAPI('config/admin/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/admin/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>