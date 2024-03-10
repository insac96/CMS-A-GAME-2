import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, dice } = await readBody(event)
    if(!_id || !dice) throw 'Dữ liệu đầu vào không hợp lệ'

    const { day, month, total } = dice
    if(!day || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.coin))
      || !!isNaN(parseInt(month.coin))
      || !!isNaN(parseInt(total.coin))
      || parseInt(day.coin) < 0
      || parseInt(month.coin) < 0
      || parseInt(total.coin) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('username type')
    if(!user) throw 'Người dùng không tồn tại'

    const update : any = {
      'dice.day.coin': parseInt(day.coin),
      'dice.month.coin': parseInt(month.coin),
      'dice.total.coin': parseInt(total.coin)
    }

    await DB.User.updateOne({ _id: _id }, update)

    logAdmin(event, `Sửa dữ liệu <b>xúc xắc</b> tài khoản <b>${user.username}</b>`)
    return resp(event, { message: 'Sửa dữ liệu xúc xắc thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})