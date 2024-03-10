import type { IAuth, IDBEvent, IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.Event.findOne({ _id: _id }).select('need type') as IDBEvent
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    const eventConfig = await DB.EventConfig.findOne({ type: eventData.type }).select('name') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'
    
    const histories = await DB.EventHistory.count({ event: eventData._id })
    if(histories > 0) throw 'Không thể xóa mốc thưởng đã có dữ liệu lịch sử'

    await DB.Event.deleteOne({ _id: _id })

    logAdmin(event, `Xóa mốc <b>${eventData.need}</b> của sự kiện <b>${eventConfig.name}</b>`)
    return resp(event, { message: 'Xóa mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})