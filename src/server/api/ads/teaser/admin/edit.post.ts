import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, code, link } = body
    if(!_id || !code || !link) throw 'Dữ liệu đầu vào không hợp lệ'

    const teaser = await DB.AdsTeaser.findOne({ _id: _id }).select('code')
    if(!teaser) throw 'Teaser không tồn tại'

    if(teaser.code != code){
      const checkDup = await DB.AdsTeaser.findOne({ code: code }).select('_id')
      if(!!checkDup) throw 'Mã Teaser đã tồn tại'
    }

    delete body['_id']
    await DB.AdsTeaser.updateOne({ _id: _id }, body)
    
    await logAdmin(event, `Sửa Teaser Page mã <b>${teaser.code}</b>`)
    return resp(event, { message: 'Sửa Teaser thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})