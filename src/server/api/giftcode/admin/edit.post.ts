import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, code, limit } = body
    if(!_id || !code) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    const giftcode = await DB.Giftcode.findOne({ _id: _id }).select('code')
    if(!giftcode) throw 'Mã không tồn tại'

    if(giftcode.code != code){
      const getByCode = await DB.Giftcode.findOne({ code: code }).select('_id')
      if(!!getByCode) throw 'Tên mã đã tồn tại'
    }

    delete body['_id']
    await DB.Giftcode.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin Giftcode <b>${giftcode.code}</b>`)
    return resp(event, { message: 'Sửa mã thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})