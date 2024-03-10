export const useTo = () => {
  const navigateToSSL = (path : string) => {
    const runtimeConfig = useRuntimeConfig()
    const route = useRequestURL()

    if(!!runtimeConfig.public.dev) return navigateTo(path)

    if(route.protocol == 'https:'){
      return navigateTo(path)
    }
    else {
      return navigateTo(`https://${runtimeConfig.public.domain}${path}`, { external: true })
    }
  }

  return { navigateToSSL }
}