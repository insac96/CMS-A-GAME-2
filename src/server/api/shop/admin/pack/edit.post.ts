import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, name, price, limit } = body
    if(!_id || !name) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(price)) 
      || parseInt(price) < 1
    ) throw 'Dữ liệu giá mua không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    const pack = await DB.ShopPack.findOne({ _id: _id }).select('name')
    if(!pack) throw 'Mã không tồn tại'

    delete body['_id']
    await DB.ShopPack.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin gói <b>${pack.name}</b> trong cửa hàng`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})