import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const gate = await DB.Gate.findOne({ _id: _id }).select('name')
    if(!gate) throw 'Kênh không tồn tại'

    const payments = await DB.Payment.count({ gate: _id })
    if(payments > 0) throw 'Không thể xóa kênh đã có giao dịch'

    await DB.Gate.deleteOne({ _id: _id })

    logAdmin(event, `Xóa kênh nạp <b>${gate.name}</b>`)
    return resp(event, { message: 'Xóa kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})