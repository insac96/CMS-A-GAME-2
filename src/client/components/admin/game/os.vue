<template>
  <div>
    <UiFlex v-if="!!os.ram" class="mb-8">
      <UiText weight="semibold" color="primary" class="mr-4">RAM</UiText>
      <UMeter 
        indicator 
        color="primary" 
        :value="(os.ram?.use / os.ram?.total) * 100" 
        :label="`${toMoney(os.ram?.use)} / ${toMoney(os.ram?.total)} MB`" 
      />
    </UiFlex>

    <UiFlex v-if="!!os.disk" class="mb-8">
      <UiText weight="semibold" color="primary" class="mr-4">DISK</UiText>
      <UMeter 
        indicator 
        color="primary" 
        :value="(os.disk?.use / os.disk?.total) * 100" 
        :label="`${toMoney(os.disk?.use)} / ${toMoney(os.disk?.total)} MB`" 
      />
    </UiFlex>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const os = ref({
  ram: null,
  disk: null
})

const getOS = async () => {
  try {
    const get = await useAPI('game/admin/os')
    os.value.ram = get.ram
    os.value.disk = get.disk
  }
  catch(e) {
    return
  }
}

getOS()
</script>