<template>
  <div class="relative h-full min-h-full">
    <AuthSign />

    <div class="flex h-full">
      <div class="
        w-[250px] min-w-[250px] max-w-[250px]
        h-full max-h-full overflow-y-auto
        sticky top-0
        xl:block hidden
        border-r border-gray-200 dark:border-gray-800
      ">
        <LayoutDefaultNav />
      </div>
      
      <div class="grow h-full max-h-full overflow-y-auto">
          <slot></slot>
      </div>
    </div>

    <LayoutDefaultNavDrag />
  </div>
</template>