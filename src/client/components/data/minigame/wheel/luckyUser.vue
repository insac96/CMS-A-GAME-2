<template>
  <UCard :ui="{ 
    header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
    body: { padding: 'p-0 sm:p-0' },
  }">
    <template #header>
      <UiText color="gray" weight="semibold">May mắn nhất</UiText>
    </template>

    <LoadingTable v-if="!list" />
    
    <div v-else>
      <DataEmpty text="Chưa có người may mắn" icon="i-bxs-color" v-if="list.length == 0" />

      <UiFlex type="col" class="gap-y-2" v-else>
        <UAlert
          v-for="(item, index) in list" :key="index"
          :avatar="{ src: item.user.avatar, alt: item.user.username }"
          variant="soft"
        >
          <template #title>
            <UiFlex justify="between">
              <UiText color="primary" weight="bold" class="capitalize">{{ item.user?.username || '...' }}</UiText>
              <UiText color="gray" size="xs">{{ useDayJs().fromTime(item.createdAt, null) }}</UiText>
            </UiFlex>
          </template>

          <template #description>
            <span class="mr-1">Tôi vừa quay được</span>
            <span v-html="item.action" class="text-primary"></span>
            <span>{{ randSuffix() }}</span>
          </template>
        </UAlert>
      </UiFlex>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps(['reload'])
const list = ref(null)
watch(() => props.reload, () => getList())

// Randow text
const randSuffix = () => {
  const suffix = [
    ', thật là hạnh phúc !',
    ', quá là bất ngờ !',
    ', ước gì lúc nào cũng may mắn thế này !',
    ', kiểu này tôi sẽ nghiện mất !',
    ', tích cực quay tay, vận may sẽ đến !',
  ]
  const index = Math.floor(Math.random() * (suffix.length - 0) + 0)
  return suffix[index]
}

// Fetch
const getList = async () => {
  try {
    const data = await useAPI('minigame/wheel/luckyUser')
    list.value = data
  }
  catch (e) {
    list.value = []
  } 
}

getList()
</script>