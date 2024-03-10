import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, pay, reason } = await readBody(event)
    if(!_id || !pay) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const { day, month, total } = pay
    if(!day || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.money))
      || !!isNaN(parseInt(month.money))
      || !!isNaN(parseInt(total.money))
      || parseInt(day.money) < 0
      || parseInt(month.money) < 0
      || parseInt(total.money) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('type username pay') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    const update : any = {}
    const change : any = []

    if(user.pay.day.money != day.money){
      change.push('ngày')
      update['pay.day.money'] = parseInt(day.money)
      logUser(event, user._id, `Tích nạp <b>ngày</b> được thay đổi từ <b>${user.pay.day.money.toLocaleString('vi-VN')}</b> thành <b>${day.money.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    }
    if(user.pay.month.money != month.money){
      change.push('tháng')
      update['pay.month.money'] = parseInt(month.money)
      logUser(event, user._id, `Tích nạp <b>tháng</b> được thay đổi từ <b>${user.pay.month.money.toLocaleString('vi-VN')}</b> thành <b>${month.money.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    }
    if(user.pay.total.money != total.money){
      change.push('tổng')
      update['pay.total.money'] = parseInt(total.money)
      logUser(event, user._id, `Tích nạp <b>tổng</b> được thay đổi từ <b>${user.pay.total.money.toLocaleString('vi-VN')}</b> thành <b>${total.money.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    }

    if(change.length > 0){
      await DB.User.updateOne({ _id: _id }, update)
      logAdmin(event, `Sửa dữ liệu tích nạp <b>${change.join(', ')}</b> của tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
    }

    return resp(event, { message: 'Sửa tích nạp thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})