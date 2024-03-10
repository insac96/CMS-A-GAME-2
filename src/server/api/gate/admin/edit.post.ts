import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, name, person, number, bonus } = body
    if(!_id || !name || !person || !number || !bonus || !bonus.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(bonus.default))
      || !!isNaN(parseInt(bonus.limit.number))
      || parseInt(bonus.default) < 0
      || parseInt(bonus.limit.number) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const gate = await DB.Gate.findOne({ _id: _id }).select('name')
    if(!gate) throw 'Kênh không tồn tại'

    delete body['_id']
    await DB.Gate.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin kênh nạp <b>${gate.name}</b>`)
    return resp(event, { message: 'Sửa kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})