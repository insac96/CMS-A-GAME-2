import type { IAuth } from "~~/types"

const typeList = ['level', 'power']
const typeName : any = {
  'level': 'cấp độ',
  'power': 'lực chiến'
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { type, server, start, end, expired, gift } = body
    if(!type || !server || !expired || !gift) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!typeList.includes(type)) throw 'Kiểu xếp hạng không hỗ trợ'
    if(start < 1 || end < 1 || start > end || end > 10 || start > 10) throw 'Số xếp hạng không hợp lệ'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    body.gift = giftFormat

    await DB.GameRankGift.create(body)
    await DB.GameRankGift.updateMany({
      type: type, server: server
    }, {
      expired: expired
    })

    logAdmin(event, `Tạo phần thưởng xếp hạng <b>${typeName[type]}</b> cho máy chủ <b>${server}</b> hạng <b>${start}-${end}</b>`)

    return resp(event, { message: 'Thêm mốc thưởng thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})