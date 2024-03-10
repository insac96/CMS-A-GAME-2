import type { IAuth, IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    if(!!body.redo){
      if(auth.type < 2) throw 'Smod không thể hoàn tác trạng thái giao dịch'
      const payment = await DB.Payment.findOne({ _id: body._id }).select('status code')
      if(!payment) throw 'Giao dịch không tồn tại'
      if(payment.status == 0) throw 'Giao dịch chưa được duyệt'
      
      payment.status = 0
      await payment.save()

      await logAdmin(event, `Hoàn tác trạng thái giao dịch <b>${payment.code}</b>`, auth._id)
      return resp(event, { message: 'Thao tác thành công' })
    }

    await verifyPayment(event, body, auth._id)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})