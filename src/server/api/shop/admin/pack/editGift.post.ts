import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const pack = await DB.ShopPack.findOne({ _id: _id }).select('name gift')
    if(!pack) throw 'Mã không tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))

    await DB.ShopPack.updateOne({ _id: _id }, { gift: giftFormat })

    logAdmin(event, `Sửa vật phẩm trong gói <b>${pack.name}</b> ở cửa hàng`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})