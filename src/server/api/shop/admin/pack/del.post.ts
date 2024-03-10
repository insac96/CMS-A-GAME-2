import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const pack = await DB.ShopPack.findOne({ _id: _id }).select('name')
    if(!pack) throw 'Gói không tồn tại'
    
    const histories = await DB.ShopPackHistory.count({ pack: _id })
    if(histories > 0) throw 'Không thể xóa gói đã có dữ liệu lịch sử'

    await DB.ShopPack.deleteOne({ _id: _id })
    
    logAdmin(event, `Xóa gói <b>${pack.name}</b> khỏi cửa hàng`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})