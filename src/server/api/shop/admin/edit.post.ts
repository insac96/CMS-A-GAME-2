import { IDBShop, IDBItem, IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, item_amount, price, limit } = body
    if(!_id || !price) throw 'Dữ liệu đầu vào không hợp lệ'
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
    ) throw 'Giới không hợp lệ'

    const shopItem = await DB.Shop.findOne({ _id: _id }).select('item') as IDBShop
    if(!shopItem) throw 'Vật phẩm không tồn tại'

    const itemData = await DB.Item.findOne({ _id: shopItem.item }).select('item_name') as IDBItem

    delete body['_id']
    await DB.Shop.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin vật phẩm <b>${itemData.item_name}</b> ở cửa hàng`)
    
    return resp(event, { message: 'Sửa vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})