import type { IAuth, IDBEvent, IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { type, need } = body
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(need)) 
      || parseInt(need) < 0
    ) throw 'Dữ liệu điều kiện mốc thưởng không hợp lệ'

    const eventConfig = await DB.EventConfig.findOne({ type: type }).select('name') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    const getByNeed = await DB.Event.findOne({ need: need, type: type }).select('_id') as IDBEvent
    if(!!getByNeed) throw 'Điều kiện mốc thưởng đã tồn tại'

    await DB.Event.create(body)

    logAdmin(event, `Tạo mốc <b>${need}</b> cho sự kiện <b>${eventConfig.name}</b>`)

    return resp(event, { message: 'Thêm mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})