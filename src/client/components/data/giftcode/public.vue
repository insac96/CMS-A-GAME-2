<template>
  <UCard :ui="{ body: {
    padding: 'p-0 sm:p-0'
  }}">
    <UTable :rows="list" :columns="columns">
      <template #code-data="{ row }">
        <UiText weight="semibold">{{ row.code }}</UiText>
      </template>

      <template #gift-data="{ row }">
        <DataItemList :items="row.gift" :currency="row.currency" class="sm:min-w-[auto] min-w-[250px]" />
      </template>
    </UTable>
  </UCard>
</template>

<script setup>
const props = defineProps(['giftcodes'])
const emits = defineEmits(['update:giftcodes'])

const list = ref([])

const columns = [{
  key: 'code',
  label: 'Mã',
},{
  key: 'gift',
  label: 'Phần thưởng',
}]

const getPublic = async () => {
  try {
    const data = await useAPI('giftcode/public')
    list.value = data
    emits('update:giftcodes', data)
  }
  catch (e){
    list.value = []
    emits('update:giftcodes', null)
  }
}

getPublic()
</script>