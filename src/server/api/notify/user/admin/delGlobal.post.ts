import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Thiếu dữ liệu ID'

    const notify = await DB.NotifyUser.findOne({ _id: _id }).select('global')
    if(!notify) return 'Thông báo không tồn tại'
    if(notify.global != 1) throw 'Không thể xóa thông báo này'

    await DB.NotifyUser.deleteOne({ _id: _id })
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})