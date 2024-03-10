import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { code, note } = body
    if(!code || !note) throw 'Dữ liệu đầu vào sai'

    const checkDup = await DB.AdsFrom.findOne({ code: code }).select('_id')
    if(!!checkDup) throw 'Tên mã nguồn đã tồn tại'

    await DB.AdsFrom.create(body)
    
    await logAdmin(event, `Thêm nguồn quảng cáo mã <b>${code}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})