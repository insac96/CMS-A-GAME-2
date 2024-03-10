import type { IAuth, IDBItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { item, item_amount, price, limit } = body
    if(!item || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(item_amount))
      || parseInt(item_amount) < 1
    ) throw 'Số lượng không hợp lệ'
    if(
      !!isNaN(parseInt(price))
      || parseInt(price) < 1
    ) throw 'Giá tiền không hợp lệ'
    if(
      !!isNaN(parseInt(limit))
      || parseInt(limit) < 0
    ) throw 'Giới hạn không hợp lệ'

    const itemData = await DB.Item.findOne({ _id: item }).select('item_name') as IDBItem
    if(!itemData) throw 'Vật phẩm không tồn tại'

    const checkDup = await DB.Shop.findOne({ item: item }).select('_id')
    if(!!checkDup) throw 'Vật phẩm cửa hàng đã tồn tại'

    await DB.Shop.create(body)

    logAdmin(event, `Thêm vật phẩm <b>${itemData.item_name}</b> vào cửa hàng`)
    return resp(event, { message: 'Thêm vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})