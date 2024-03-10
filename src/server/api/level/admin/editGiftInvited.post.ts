import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, gift_invited } = body
    if(!_id || !gift_invited) throw 'Dữ liệu đầu vào không hợp lệ'

    const levelData = await DB.Level.findOne({ _id: _id }).select('number')
    if(!levelData) throw 'Cấp độ không tồn tại'

    const giftFormat = gift_invited.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    
    await DB.Level.updateOne({ _id: _id }, { gift_invited: giftFormat })

    logAdmin(event, `Cập nhật <b>phần thưởng cho bạn bè được mời</b> của cấp độ <b>${levelData.number}</b>`)
    return resp(event, { message: 'Sửa phần thưởng thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})