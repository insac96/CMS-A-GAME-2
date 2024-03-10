import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, type, color, title, content, link, pin } = body
    if(!_id) throw 'Thiếu dữ liệu ID'
    if(type == undefined || type > 2 || type < 0) throw 'Loại thông báo không hỗ trợ'
    if(!!title && title.length > 20) throw 'TIêu đề không hợp lệ'
    if(!content) throw 'Vui lòng thêm nội dung'
    if(content.length > 200) throw 'Nội dung tối đa 200 ký tự'
    if(pin < 0 || pin > 1) throw 'Dữ liệu ghim không hợp lệ'

    const notify = await DB.NotifyUser.findOne({ _id: _id }).select('global')
    if(!notify) return 'Thông báo không tồn tại'
    if(notify.global != 1) throw 'Không thể sửa thông báo này'

    delete body['_id']
    await DB.NotifyUser.updateOne({ _id: notify._id }, body)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})