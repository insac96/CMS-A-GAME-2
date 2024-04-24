import type { IDBGate, IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { money, code, key } = query
    if(!money || !code || !key) throw 'Không có quyền quy cập'

    // Get Payment
    const realCode = (code as string).trim().replace(/\s/g, '').toUpperCase()
    const payment = await DB.Payment.findOne({ code: realCode }).select('_id gate') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'

    // Get Gate
    const gate = await DB.Gate.findOne({ _id: payment.gate }).select('key') as IDBGate
    if(!gate) throw 'Kênh nạp không tồn tại'
    if(!gate.key) throw 'Kênh chưa hỗ trợ tự động duyệt'
    if(gate.key != key) throw 'Chữ ký không hợp lệ'

    await verifyPayment(event, {
      _id: payment._id,
      status: 1,
      money: Number(money),
      reason: 'Không thể xác thực giao dịch'
    })

    resp(event, { message: 'Xử lý thành công' })
  } 
  catch (e:any) {
    setResponseStatus(event, 500)
    return {
      message: e.toString()
    }
  }
})