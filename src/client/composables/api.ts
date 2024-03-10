import type { IResp } from '~~/types'

export const useAPI = async (path : string, post?: any, options: any = {}) => {
  const { data, error } = await useFetch(`/api/${path}`, {
    method: !!post ? 'POST' : 'GET',
    body: !!post ? post : null,
    ...options
  })

  if(error.value) {
    const statusCode = error.value.statusCode
    const message = error.value.message
    if(process.server){
      throw createError({ statusCode, message })
    }
    if(process.client){
      showError({ statusCode, statusMessage:message })
      return Promise.reject(false)
    }
  }
  else {
    if(!data.value) return Promise.reject(false)
    const { code, message, result } = data.value as IResp

    if(!!message && process.client){
      const toast = useToast()
      toast.add({
        title: 'Thông báo',
        description: message,
        color: code == 200 ? 'green' : 'red',
        icon: code == 200 ? 'i-bx-check' : 'i-bx-error',
        timeout: 2000
      })
    }

    if(code == 200) {
      return Promise.resolve(result || null)
    }
    else if(code == 500){
      if(process.server){
        throw createError({ statusCode:code, message:message })
      }
      if(process.client){
        showError({ statusCode:code, statusMessage:message })
        return Promise.reject(message)
      }
    }
    else if(code == 401) {
      const { removeAuth } = useAuthStore()
      removeAuth()
      return Promise.reject(message)
    }
    else {
      return Promise.reject(message)
    }
  }
}