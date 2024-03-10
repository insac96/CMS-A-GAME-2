import type { IAuth, IDBItem, IDBLimitedEventLuckyMoney } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const luckyMoneyItem = await DB.LimitedEventLuckyMoney.findOne({ _id: _id }).select('item') as IDBLimitedEventLuckyMoney
    if(!luckyMoneyItem) throw 'Vật phẩm không tồn tại'

    const itemData = await DB.Item.findOne({ _id: luckyMoneyItem.item }).select('item_name') as IDBItem
    if(!itemData) throw 'Vật phẩm trò chơi không tồn tại'

    await DB.LimitedEventLuckyMoney.deleteOne({ _id: _id })

    logAdmin(event, `Xóa vật phẩm <b>${itemData.item_name}</b> khỏi rút may mắn`)
    return resp(event, { message: 'Xóa vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})