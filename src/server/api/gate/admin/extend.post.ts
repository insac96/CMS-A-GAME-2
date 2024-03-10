import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, key, qrcode } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const gate = await DB.Gate.findOne({ _id: _id }).select('name')
    if(!gate) throw 'Kênh không tồn tại'

    delete body['_id']
    await DB.Gate.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa tiện ích kênh nạp <b>${gate.name}</b>`)
    return resp(event, { message: 'Sửa tiện ích kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})