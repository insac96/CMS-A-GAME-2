import type { IAuth, IDBEvent, IDBEventConfig } from "~~/types"

const typeName : any = {
  'login.month' : 'Đăng nhập tháng', 
  'login.total': 'Đăng nhập tổng', 
  'pay.total.money': 'Tích nạp tổng', 
  'pay.day.money': 'Tích nạp ngày', 
  'pay.month.money': 'Tích nạp tháng', 
  'spend.total.coin': 'Tiêu phí tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng'
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, need } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(need)) 
      || parseInt(need) < 0
    ) throw 'Dữ liệu điều kiện mốc thưởng không hợp lệ'

    const eventData = await DB.Event.findOne({ _id: _id }).select('type need') as IDBEvent
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    const eventConfig = await DB.EventConfig.findOne({ type: eventData.type }).select('name') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    if(eventData.need != need){
      const getByNeed = await DB.Event.findOne({ need: need, type: eventData.type }).select('_id')
      if(!!getByNeed) throw 'Điều kiện mốc thưởng đã tồn tại'
    }

    delete body['_id']
    await DB.Event.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa mốc <b>${eventData.need}</b> cho sự kiện <b>${eventConfig.name}</b>`)

    return resp(event, { message: 'Sửa mốc thưởng thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})