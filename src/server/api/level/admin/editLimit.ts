import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, limit } = await readBody(event)
    if(!_id || !limit) throw 'Dữ liệu đầu vào không hợp lệ'

    const { pay, spend, wheel, dice } = limit
    if(!pay || !spend || !wheel || !dice) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!pay.day || !pay.month || !spend.day || !spend.month || !dice.day || !dice.month) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(pay.day.money)) 
      || !!isNaN(parseInt(pay.day.count))
      || parseInt(pay.day.money) < 0
      || parseInt(pay.day.count) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(pay.month.money)) 
      || !!isNaN(parseInt(pay.month.count))
      || parseInt(pay.month.money) < 0
      || parseInt(pay.month.count) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(spend.day.coin)) 
      || !!isNaN(parseInt(spend.day.count))
      || parseInt(spend.day.coin) < 0
      || parseInt(spend.day.count) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(spend.month.coin)) 
      || !!isNaN(parseInt(spend.month.count))
      || parseInt(spend.month.coin) < 0
      || parseInt(spend.month.count) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(wheel.day)) 
      || !!isNaN(parseInt(wheel.month))
      || parseInt(wheel.day) < 0
      || parseInt(wheel.month) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(dice.day.coin)) 
      || !!isNaN(parseInt(dice.day.count))
      || parseInt(dice.day.coin) < 0
      || parseInt(dice.day.count) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(dice.month.coin)) 
      || !!isNaN(parseInt(dice.month.count))
      || parseInt(dice.month.coin) < 0
      || parseInt(dice.month.count) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const level = await DB.Level.findOne({ _id: _id }).select('_id number')
    if(!level) throw 'Cấp độ không tồn tại'

    await DB.Level.updateOne({ _id: _id },{ limit: limit })
    
    logAdmin(event, `Sửa giới hạn cấp độ <b>${level.number}</b>`)
    return resp(event, { message: 'Sửa giới hạn thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})