import type { IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { Code, CardValue, TrxID, Mess, Reason } = query
    if(Code === undefined || CardValue === undefined || TrxID === undefined) throw 'Không có quyền quy cập'
    if(Code == 99) throw 'Hệ thống bảo trì'

    const status = (Code == 5) ? 2 : ((!CardValue || CardValue == 0) ? 2 : 1) // 1 Success, 2 Refuse
    const token = TrxID
		const money = Number(CardValue)

    const payment = await DB.Payment.findOne({ token: token }).select('_id') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'

    await verifyPayment(event, {
      _id: payment._id,
      status: status,
      money: money,
      reason: Reason as string || Mess as string || 'Thẻ sai'
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