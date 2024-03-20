import type { IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { status, request_id, card_value, code, serial, callback_sign, message } = query
    if(
      status === undefined 
      || request_id === undefined
      || card_value === undefined 
      || code === undefined 
      || serial === undefined 
      || callback_sign == undefined
    ) throw 'Không có quyền quy cập'

    const realStatus = (status != 1) ? 2 : ((card_value == 0) ? 2 : 1) // 1 Success, 2 Refuse
    const token = request_id
		const money = Number(card_value)

    const payment = await DB.Payment.findOne({ token: token }).select('_id') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'

    await verifyPayment(event, {
      _id: payment._id,
      status: realStatus,
      money: money,
      reason: message as string || 'Không có nội dung'
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