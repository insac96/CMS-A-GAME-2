export const useNotify = () => {
  const toast = useToast()

  function error(text : string) {
    toast.add({
      title: 'Thông báo',
      color: 'red',
      icon: 'i-bx-error',
      description: text,
      timeout: 2000
    })
  }

  function success(text : string) {
    toast.add({
      title: 'Thông báo',
      color: 'green',
      icon: 'i-bx-check',
      description: text,
      timeout: 2000
    })
  }

  return { error, success }
}