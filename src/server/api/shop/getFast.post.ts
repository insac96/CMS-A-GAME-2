import type { IDBShop, IDBItem, IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { item_id, item_name, price, server_id } = await readBody(event)
    if(!item_id) throw 'Không tìm thấy ID vật phẩm'

    let item = await DB.Item.findOne({ item_id: item_id, type: 'game_recharge' }).select('item_name item_image type') as IDBItem
    let shop = null

    if(!item){
      if(!item_name || !price) throw 'Vật phẩm không hỗ trợ'

      item = await DB.Item.create({
        item_id: item_id,
        item_name: item_name,
        type: 'game_recharge'
      })

      shop = await DB.Shop.create({
        item: item._id,
        price: price
      }) as IDBShop
    }
    else {
      shop = await DB.Shop.findOne({ item: item._id }).select('price') as IDBShop
      if(!shop) throw 'Vật phẩm không tồn tại'
    }

    const result = {
      item: {
        _id: shop._id,
        name: item.item_name,
        image: item.item_image,
        type: item.type,
        price: shop.price
      },
      server: server_id
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})