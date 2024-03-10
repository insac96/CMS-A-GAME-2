import md5 from 'md5'
import type { IAuth, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, email, phone, password, type, block } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 0 || type > 2) throw 'Dữ liệu quyền hạn không hợp lệ'
    if(block < 0 || block > 1) throw 'Dữ liệu khóa không hợp lệ'

    const user = await DB.User.findOne({_id: _id})
    .select('username email phone type block') as IDBUser

    if(!user) throw 'Người dùng không tồn tại'
    if(user.type == 2 && auth.type < 2) throw 'Smod không thể sửa thông tin của Admin'

    const update : any = { type: type, block: block }
    const change = []

    if(!!email && user.email != email){
      const check = await DB.User.findOne({ email: email }).select('_id')
      if(!!check) throw 'Email đã tồn tại'
      update['email'] = email
      change.push('Email')
    }
    if(!!phone && user.phone != phone){
      const check = await DB.User.findOne({ phone: phone }).select('_id')
      if(!!check) throw 'Số điện thoại đã tồn tại'
      update['phone'] = phone
      change.push('Số điện thoại')
    }
    if(!!password){
      update['password'] = md5(password)
      change.push('Mật khẩu')
    }
    if(user.type != type){
      update['type'] = type
      change.push('Quyền tài khoản')
    }
    if(user.block != block){
      update['block'] = block
      change.push('Trạng thái khóa')
    }

    if(change.length > 0){
      await DB.User.updateOne({ _id: _id }, update)
      logAdmin(event, `Sửa <b>${change.join(', ')}</b> của tài khoản <b>${user.username}</b>`)
    }
    
    return resp(event, { message: 'Sửa thông tin thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})