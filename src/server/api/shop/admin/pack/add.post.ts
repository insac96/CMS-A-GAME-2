import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { name, price, limit } = body
    if(!name) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(price)) 
      || parseInt(price) < 1
    ) throw 'Dữ liệu giá mua không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    await DB.ShopPack.create(body)

    logAdmin(event, `Thêm gói <b>${name}</b> vào cửa hàng`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})