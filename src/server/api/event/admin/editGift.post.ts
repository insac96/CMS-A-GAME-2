import type { IAuth, IDBEventConfig, IDBEvent } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.Event.findOne({ _id: _id }).select('need type') as IDBEvent
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    const eventConfig = await DB.EventConfig.findOne({ type: eventData.type }).select('name') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    
    await DB.Event.updateOne({ _id: _id }, { gift: giftFormat })

    logAdmin(event, `Cập nhật phần thưởng cho mốc <b>${eventData.need}</b> cho sự kiện <b>${eventConfig.name}</b>`)
    return resp(event, { message: 'Sửa phần thưởng mốc thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})