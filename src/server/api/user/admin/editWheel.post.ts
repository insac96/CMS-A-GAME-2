import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, wheel } = await readBody(event)
    if(!_id || !wheel) throw 'Dữ liệu đầu vào không hợp lệ'

    const { day, month, total } = wheel
    if(!day || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day))
      || !!isNaN(parseInt(month))
      || !!isNaN(parseInt(total))
      || parseInt(day) < 0
      || parseInt(month) < 0
      || parseInt(total) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('type username')
    if(!user) throw 'Người dùng không tồn tại'

    const update : any = {
      'wheel.day': parseInt(day),
      'wheel.month': parseInt(month),
      'wheel.total': parseInt(total)
    }

    await DB.User.updateOne({ _id: _id }, update)

    logAdmin(event, `Sửa dữ liệu <b>vòng quay</b> tài khoản <b>${user.username}</b>`)
    return resp(event, { message: 'Sửa dữ liệu vòng quay thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})