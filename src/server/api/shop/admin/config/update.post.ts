import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const data = await readBody(event)
    const { maintenance, discount } = data
    if(!!isNaN(parseInt(discount.number)) || parseInt(discount.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.ShopConfig.updateMany({}, data)
    logAdmin(event, 'Cập nhật <b>cấu hình</b> cửa hàng')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})