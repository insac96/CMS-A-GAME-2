import type { IAuth, IDBItem, IDBLimitedEventLuckyMoney } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, amount, percent } = body
    if(!_id || !amount) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(!!isNaN(parseFloat(percent)) || (parseFloat(percent) * -1) > 0) throw 'Tỷ lệ không hợp lệ'

    const luckyMoneyItem = await DB.LimitedEventLuckyMoney.findOne({ _id: _id }).select('item') as IDBLimitedEventLuckyMoney
    if(!luckyMoneyItem) throw 'Vật phẩm không tồn tại'

    const itemData = await DB.Item.findOne({ _id: luckyMoneyItem.item }).select('item_name') as IDBItem
    if(!itemData) throw 'Vật phẩm trò chơi không tồn tại'

    delete body['_id']
    await DB.LimitedEventLuckyMoney.updateOne({ _id: _id }, body)
    
    logAdmin(event, `Sửa thông tin vật phẩm <b>${itemData.item_name}</b> trong rút may mắn`)
    
    return resp(event, { message: 'Sửa vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})