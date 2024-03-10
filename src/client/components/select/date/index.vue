<template>
  <div>
    <VCalendarDatePicker
      v-model="date"
      transparent
      borderless
      :mode="mode"
      :color="appConfig.ui.primary"
      :is-dark="isDark"
    >
      <template #default="{ togglePopover }">
        <UiFlex class="relative">
          <UInput 
            class="grow"
            readonly
            :model-value="show" 
            @click="togglePopover" 
            :placeholder="props.placeholder || 'Chọn thời gian'"
            :size="size"
          />
          <UIcon 
            v-if="!!props.modelValue"
            name="i-bx-x" 
            color="gray" 
            pointer 
            class="absolute right-2"
            @click="emit('update:modelValue', null)" 
          />
        </UiFlex>
      </template>
    </VCalendarDatePicker>
  </div>
</template>

<script setup>
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const { displayFull, displayTime } = useDayJs()

const props = defineProps({ 
  modelValue: Date,
  time: Boolean,
  placeholder: String,
  size: String
})
const emit = defineEmits(['update:modelValue'])

const appConfig = useAppConfig()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const mode = computed(() => !!props.time ? 'dateTime' : 'date')

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const show = computed(() => {
  if(!date.value) return null
  if(!!props.time) return displayFull(date.value)
  else return displayTime(date.value)
})
</script>