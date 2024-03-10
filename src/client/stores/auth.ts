import { defineStore } from 'pinia'
import type { IDBUserStore } from '~~/types'

export const useAuthStore = defineStore('auth', () => {
  const modal = ref(false)
  const isLogin = ref(false)
  const profile : Ref<IDBUserStore | undefined> = ref(undefined)

  function setModal (data : boolean) {
    modal.value = data
  }

  function setAuth (data : IDBUserStore) {
    isLogin.value = true
    profile.value = data
  }

  function removeAuth () {
    isLogin.value = false
    profile.value = undefined
  }

  return { modal, isLogin, profile, setModal, setAuth, removeAuth }
})