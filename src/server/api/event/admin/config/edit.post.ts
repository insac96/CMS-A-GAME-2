import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const {_id, start, end } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventConfig = await DB.EventConfig.findOne({ _id: _id }).select('name')
    if(!eventConfig) throw 'Cấu hình sự kiện không tồn tại'

    delete body['_id']
    await DB.EventConfig.updateOne({ _id: _id }, body)
    
    logAdmin(event, `Sửa cấu hình sự kiện <b>${ eventConfig.name }</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})