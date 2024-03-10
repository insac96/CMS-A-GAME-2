import type { IAuth, IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, start, end } = await readBody(event)
    if(!_id || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const startDel = DayJS(start)
    const endDel = DayJS(end)
    if(startDel.unix() > endDel.unix()) throw 'Thời gian bắt đầu không thể lớn hơn kết thúc'
    if(startDel.unix() == endDel.unix()) throw 'Hai mốc thời gian không thể giống nhau'

    const eventConfig = await DB.EventConfig.findOne({ _id: _id }).select('name type') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    const events = await DB.Event.find({ type: eventConfig.type }).select('_id')

    const match : any = {}
    match['event'] = { $in: events.map(i => i._id) }
    match['createdAt'] = { $gte: new Date(startDel['$d']), $lte: new Date(endDel['$d']) }

    await DB.EventHistory.deleteMany(match)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})