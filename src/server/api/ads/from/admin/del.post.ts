import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const from = await DB.AdsFrom.findOne({ _id: _id }).select('code')
    if(!from) throw 'Nguồn không tồn tại'

    const user = await DB.User.count({
      'reg.from': from._id
    })
    if(user > 0) throw 'Không thể xóa nguồn quảng cáo đã có người tương tác'

    await DB.AdsFrom.deleteOne({ _id: _id })

    await logAdmin(event, `Xóa nguồn quảng cáo mã <b>${from.code}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})