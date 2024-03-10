import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const giftcode = await DB.Giftcode.findOne({ _id: _id }).select('code')
    if(!giftcode) throw 'Mã không tồn tại'
    
    const histories = await DB.GiftcodeHistory.count({ giftcode: _id })
    if(histories > 0) throw 'Không thể xóa mã đã có dữ liệu lịch sử'

    await DB.Giftcode.deleteOne({ _id: _id })
    
    logAdmin(event, `Xóa Giftcode <b>${giftcode.code}</b>`)
    return resp(event, { message: 'Xóa mã thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})