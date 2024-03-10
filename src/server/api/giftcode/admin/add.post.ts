import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { code, limit } = body
    if(!code) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    const getByCode = await DB.Giftcode.findOne({ code: code }).select('_id')
    if(!!getByCode) throw 'Tên mã đã tồn tại'

    await DB.Giftcode.create(body)

    logAdmin(event, `Thêm Giftcode <b>${code}</b>`)
    return resp(event, { message: 'Thêm mã thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})