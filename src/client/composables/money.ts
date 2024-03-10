export const useMoney = () => {
  function financial(x:number, fix:number = 1) : string {
    return Number.parseFloat(String(x)).toFixed(fix)
  }

  const toMoney = (number : number | string) : string => {
    const num = Number(number)
    return num.toLocaleString("vi-VN")
  }

  const vnMiniMoney = (number : number | string) : string | number => {
    const num = Number(number)
    if(num < 1000) return toMoney(num)
    if(num >= 1000 && num <= 999999) return `${financial((num / 1000), 0)} nghìn +`
    if(num > 999999 && num <= 999999999) return `${financial((num / 1000000), 0)} triệu +`
    if(num > 999999999) return `${financial((num / 1000000000), 0)} tỷ +`
    return 0
  }

  const miniMoney = (number : number | string) : string | number => {
    const num = Number(number)
    if(num < 1000) return toMoney(num)

    if(num < 1000) return num.toLocaleString("vi-VN")
    if(num >= 1000 && num <= 999999) return `${financial(num / 1000)}k`
    if(num > 999999 && num <= 999999999) return `${financial(num / 1000000)}m`
    if(num > 999999999 && num <= 999999999999) return `${financial(num / 1000000000)}b`
    if(num > 999999999999 && num <= 999999999999999) return `${financial(num / 1000000000000)}t`
    if(num > 999999999999999 && num <= 999999999999999999) return `${financial(num / 1000000000000000)}q`
    return 0
  }

  return { toMoney, vnMiniMoney, miniMoney }
}