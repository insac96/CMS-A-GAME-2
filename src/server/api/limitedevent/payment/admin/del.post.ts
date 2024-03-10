import type { IAuth, IDBLimitedEventPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.LimitedEventPayment.findOne({ _id: _id }).select('need') as IDBLimitedEventPayment
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    await DB.LimitedEventPayment.deleteOne({ _id: _id })

    logAdmin(event, `Xóa mốc <b>${eventData.need}</b> cho sự kiện <b>liên nạp</b>`)
    return resp(event, { message: 'Xóa mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})