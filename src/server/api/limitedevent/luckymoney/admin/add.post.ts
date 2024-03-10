import type { IAuth, IDBItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { item, amount, percent } = body
    if(!item || !amount) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(!!isNaN(parseFloat(percent)) || (parseFloat(percent) * -1) > 0) throw 'Tỷ lệ không hợp lệ'

    const itemData = await DB.Item.findOne({ _id: item }).select('item_name') as IDBItem
    if(!itemData) throw 'Vật phẩm trò chơi không tồn tại'

    await DB.LimitedEventLuckyMoney.create(body)

    logAdmin(event, `Thêm vật phẩm <b>${itemData.item_name}</b> vào rút may mắn`)
    return resp(event, { message: 'Thêm vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})