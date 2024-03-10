import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, spend, reason } = await readBody(event)
    if(!_id || !spend) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const { day, month, total } = spend
    if(!day || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.coin))
      || !!isNaN(parseInt(month.coin))
      || !!isNaN(parseInt(total.coin))
      || parseInt(day.coin) < 0
      || parseInt(month.coin) < 0
      || parseInt(total.coin) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('type username spend') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    const update : any = {}
    const change : any = []

    if(user.spend.day.coin != day.coin){
      change.push('ngày')
      update['spend.day.coin'] = parseInt(day.coin)
      logUser(event, user._id, `Tiêu phí <b>ngày</b> được thay đổi từ <b>${user.spend.day.coin.toLocaleString('vi-VN')}</b> thành <b>${day.coin.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    }
    if(user.spend.month.coin != month.coin){
      change.push('tháng')
      update['spend.month.coin'] = parseInt(month.coin)
      logUser(event, user._id, `Tiêu phí <b>tháng</b> được thay đổi từ <b>${user.spend.month.coin.toLocaleString('vi-VN')}</b> thành <b>${month.coin.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    }
    if(user.spend.total.coin != total.coin){
      change.push('tổng')
      update['spend.total.coin'] = parseInt(total.coin)
      logUser(event, user._id, `Tiêu phí <b>tổng</b> được thay đổi từ <b>${user.spend.total.coin.toLocaleString('vi-VN')}</b> thành <b>${total.coin.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    }

    if(change.length > 0){
      await DB.User.updateOne({ _id: _id }, update)
      logAdmin(event, `Sửa dữ liệu tiêu phí <b>${change.join(', ')}</b> của tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
    }

    return resp(event, { message: 'Sửa tiêu phí thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})