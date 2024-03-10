import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, reason } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID giao dịch'
    if(!reason) throw 'Vui lòng nhập lý do hủy'

    const payment = await DB.Payment.findOne({ _id: _id })
    .select('user money status')

    if(!payment) throw 'Giao dịch không tồn tại'
    if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'
    if(payment.user.toString() !== auth._id.toString()) throw 'Bạn không phải chủ giao dịch'

    await verifyPayment(event, {
      _id: payment._id,
      money: payment.money,
      status: 2,
      reason: reason
    }, undefined, false)

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})