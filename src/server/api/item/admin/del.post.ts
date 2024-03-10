import type { IAuth } from "~~/types"

const typeList = [
  'game_item', 'game_recharge'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const item = await DB.Item.findOne({ _id: _id }).select('_id type item_name')
    if(!item) throw 'Vật phẩm không tồn tại'
    if(!typeList.includes(item.type)) throw 'Không thể xóa vật phẩm mặc định'

    const shop = await DB.Shop.count({ item: _id })
    if(shop > 0) throw 'Không thể xóa vật phẩm đã có trong cửa hàng'
    const shopHistories = await DB.ShopHistory.count({ item: _id })
    if(shopHistories > 0) throw 'Không thể xóa vật phẩm đã có trong lịch sử cửa hàng'

    const wheel = await DB.Wheel.count({ item: _id })
    if(wheel > 0) throw 'Không thể xóa vật phẩm đã có trong vòng quay'
    const wheelHistories = await DB.WheelHistory.count({ item: _id })
    if(wheelHistories > 0) throw 'Không thể xóa vật phẩm đã có trong lịch sử vòng quay'

    const evt = await DB.Event.count({ 
      gift: { $elemMatch: { item: _id }} 
    })
    if(evt > 0) throw 'Không thể xóa vật phẩm đã có trong sự kiện'

    const giftcode = await DB.Giftcode.count({
      gift: { $elemMatch: { item: _id }} 
     })
    if(giftcode > 0) throw 'Không thể xóa vật phẩm đã có trong giftcode'

    await DB.Item.deleteOne({ _id: _id })
    logAdmin(event, `Xóa vật phẩm trò chơi <b>${item.item_name}</b>`)
    return resp(event, { message: 'Xóa vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})