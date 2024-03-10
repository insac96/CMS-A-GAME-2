import md5 from 'md5'
import type { IAuth, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { type } = await readBody(event)

    if(type == 'pay.day'){
      await DB.User.updateMany({}, { 'pay.day.money' : 0, 'pay.day.count': 0 })
      await logAdmin(event, 'Reset <b>tích nạp ngày</b> tất cả tài khoản')
    }
    if(type == 'pay.month'){
      await logAdmin(event, 'Reset <b>tích nạp tháng</b> tất cả tài khoản')
      await DB.User.updateMany({}, { 'pay.month.money' : 0, 'pay.month.count': 0 })
    }
    if(type == 'pay.total'){
      await logAdmin(event, 'Reset <b>tích nạp tổng</b> tất cả tài khoản')
      await DB.User.updateMany({}, { 'pay.total.money' : 0, 'pay.total.count': 0 })
    }

    if(type == 'spend.day'){
      await DB.User.updateMany({}, { 'spend.day.coin' : 0, 'spend.day.count': 0 })
      await logAdmin(event, 'Reset <b>tiêu phí ngày</b> tất cả tài khoản')
    }
    if(type == 'spend.month'){
      await logAdmin(event, 'Reset <b>tiêu phí tháng</b> tất cả tài khoản')
      await DB.User.updateMany({}, { 'spend.month.coin' : 0, 'spend.month.count': 0 })
    }
    if(type == 'spend.total'){
      await logAdmin(event, 'Reset <b>tiêu phí tổng</b> tất cả tài khoản')
      await DB.User.updateMany({}, { 'spend.total.coin' : 0, 'spend.total.count': 0 })
    }
    
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})