export default defineNuxtPlugin(async () => {
  const { bootConfig } = useConfigStore()
  await bootConfig()
})