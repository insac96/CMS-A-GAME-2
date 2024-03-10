import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, number, bonus, discount } = body
    if(
      !_id
      || !!isNaN(parseInt(number)) 
      || !!isNaN(parseInt(bonus))
      || !!isNaN(parseInt(discount))
      || parseInt(bonus) < 0 
      || parseInt(discount) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const level = await DB.Level.findOne({ _id: _id }).select('_id number')
    if(!level) throw 'Cấp độ không tồn tại'

    if(level.number != number){
      if(level.number == 1) throw 'Không thể sửa cấp độ 1'
      if(parseInt(number) < 2) throw 'Cấp độ phải lớn hơn 1'

      const check = await DB.Level.findOne({ number: number }).select('_id')
      if(!!check) throw 'Số cấp độ đã tồn tại'
    }

    delete body['_id']
    await DB.Level.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin cấp độ <b>${level.number}</b>`)
    return resp(event, { message: 'Sửa cấp độ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})