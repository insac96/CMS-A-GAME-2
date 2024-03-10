import type { IAuth, IDBGameRankGift } from "~~/types"

const typeName : any = {
  'level': 'cấp độ',
  'power': 'lực chiến'
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const rankgift = await DB.GameRankGift.findOne({ _id: _id }).select('type server start end') as IDBGameRankGift
    if(!rankgift) throw 'Mốc quà không tồn tại'

    await DB.GameRankGift.deleteOne({ _id: rankgift._id })

    logAdmin(event, `Xóa phần thưởng xếp hạng <b>${typeName[rankgift.type]}</b> cho máy chủ <b>${rankgift.server}</b> hạng <b>${rankgift.start}-${rankgift.end}</b>`)

    return resp(event, { message: 'Xóa mốc thưởng thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})