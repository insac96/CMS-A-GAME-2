import { Types } from 'mongoose'
import type { IAuth } from '~~/types'

const hasDup = (arr : Array<string>) => {
  return new Set(arr).size !== arr.length
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { to, type, title, content, link, pin } = body

    if(!to || !Array.isArray(to)) throw 'Dữ liệu gửi không hợp lệ'
    if(!!hasDup(to)) throw 'Dữ liệu gửi không hợp lệ'
    if(to.length == 0 && auth.type < 1) throw 'Bạn không có quyền gửi thông báo cho tất cả mọi người'
    if(type == undefined || type > 2 || type < 0) throw 'Loại thông báo không hỗ trợ'
    if(type > 0 && auth.type < 1) throw 'Bạn không có quyền gửi loại thông báo này'
    if(!!title && title.length > 20) throw 'TIêu đề không hợp lệ'
    if(!content) throw 'Vui lòng thêm nội dung'
    if(content.length > 200) throw 'Nội dung tối đa 200 ký tự'
    if(!!link && auth.type < 1) throw 'Bạn không có quyền gắn đường dẫn vào thông báo'
    if(!!pin && auth.type < 1) throw 'Bạn không có quyền ghim thông báo'

    const user = await DB.User.findOne({ _id: auth._id }).select('currency')
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.notify < 1) throw 'Bạn đã hết lượt gửi thông báo'

    const toList = to.map(id => ({ user: new Types.ObjectId(id) }))
    body.from = auth._id
    body.to = toList
    body.global = toList.length == 0 ? 1 : 0

    await DB.NotifyUser.create(body)
    await DB.User.updateOne({ _id: auth._id }, { $inc: { 'currency.notify': -1 }})
    return resp(event, { message: 'Gửi thông báo thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})