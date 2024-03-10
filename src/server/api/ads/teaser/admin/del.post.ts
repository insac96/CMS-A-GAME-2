import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const teaser = await DB.AdsTeaser.findOne({ _id: _id }).select('code')
    if(!teaser) throw 'Teaser không tồn tại'

    await DB.AdsTeaser.deleteOne({ _id: _id })

    await logAdmin(event, `Xóa Teaser Page mã <b>${teaser.code}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})