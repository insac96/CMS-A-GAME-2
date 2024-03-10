import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { ip, action } = body
    if(!ip || !action) throw 'Dữ liệu đầu vào không hợp lệ'

    if(action == 'block'){
      const lockIP = await DB.LogBlockIP.findOne({ ip: ip }).select('_id')
      if(!!lockIP) throw 'Địa chỉ IP đã có trong danh sách khóa'

      await DB.LogBlockIP.create({ ip: ip })
      logAdmin(event, `Khóa IP <b>${ip}</b>`)

      return resp(event, { message: 'Khóa IP thành công' })
    }

    else if(action == 'unblock'){
      const lockIP = await DB.LogBlockIP.findOne({ ip: ip }).select('_id')
      if(!lockIP) throw 'Địa chỉ IP không có trong danh sách khóa'

      await DB.LogBlockIP.deleteMany({ ip: ip })
      logAdmin(event, `Mở khóa IP <b>${ip}</b>`)

      return resp(event, { message: 'Mở khóa IP thành công' })
    }

    else throw 'Hành động không hỗ trợ'
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})