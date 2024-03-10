<template>
  <UPopover>
    <template #default>
      <UButton 
        icon="i-bxs-brush"
        color="gray" 
        variant="ghost" 
        aria-label="Theme"
      />
    </template>

    <template #panel>
      <div class="p-2 w-56">
        <SettingMode class="mb-2"/>
        <SettingColor />
      </div>
    </template>
  </UPopover>
</template>