import type { IDBLevel, IDBUser, IDBShop, IDBItem, IAuth, IDBShopConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { item, server, role, amount } = await readBody(event)
    if(!item) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'

    // Shop Config
    const shopConfig = await DB.ShopConfig.findOne() as IDBShopConfig
    if(!shopConfig) throw 'Không tìm thấy cấu hình cửa hàng'
    if(!!shopConfig.maintenance) throw 'Cửa hàng đang bảo trì, vui lòng quay lại sau'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin level spend') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('limit.spend discount') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Shop Item Data
    const shopData = await DB.Shop
    .findOne({ _id: item }) 
    .select('item item_amount price limit')
    .populate({ path: 'item', select: 'item_id item_name type' }) as IDBShop
    if(!shopData) throw 'Vật phẩm không tồn tại'

    // Total Price
    const price = shopData.price * parseInt(amount)
    const discountLevel = level.discount
    const discountSystem = getShopDiscount(event, shopConfig)
    const discount = discountLevel + discountSystem > 100 ? 100 : discountLevel + discountSystem
    const totalPrice = Math.floor(price - Math.floor(price * discount / 100))
    if(totalPrice > user.currency.coin) throw 'Số dư xu không đủ'

    // Check Limit Spend
    const spend = user.spend
    const limit = level.limit.spend
    const limitCoinDay = limit.day.coin == 0 ? -1 : (limit.day.coin - spend.day.coin) < 0 ? 0 : (limit.day.coin - spend.day.coin)
    const limitCountyDay = limit.day.count == 0 ? -1 : (limit.day.count - spend.day.count) < 0 ? 0 : (limit.day.count - spend.day.count)
    const limitCoinMonth = limit.month.coin == 0 ? -1 : (limit.month.coin - spend.month.coin) < 0 ? 0 : (limit.month.coin - spend.month.coin)
    const limitCountMonth = limit.month.count == 0 ? -1 : (limit.month.count - spend.month.count) < 0 ? 0 : (limit.month.count - spend.month.count)
  
    if(limitCountyDay != -1 && limitCountyDay <= 0) throw 'Bạn đã hết lượt tiêu phí hôm nay'
    if(limitCoinDay != -1 && limitCoinDay <= 0) throw 'Bạn đã đạt giới hạn tiêu phí hôm nay'
    if(limitCoinDay != -1 && totalPrice > limitCoinDay) throw `Hôm nay bạn chỉ có thể tiêu tối đa ${limitCoinDay.toLocaleString("vi-VN")} Xu`
    if(limitCountMonth != -1 && limitCountMonth <= 0) throw 'Bạn đã hết lượt tiêu phí tháng này'
    if(limitCoinMonth != -1 && limitCoinMonth <= 0) throw 'Bạn đã đạt giới hạn tiêu phí tháng này'
    if(limitCoinMonth != -1 && totalPrice > limitCoinMonth) throw `Tháng này bạn chỉ có thể tiêu tối đa ${limitCoinMonth.toLocaleString("vi-VN")} Xu`

    // Item Data
    const itemData = shopData.item as IDBItem
    const itemType = itemData.type

    // Check Limit Buy
    if(shopData.limit > 0){
      const countBuy = await DB.ShopHistory.count({ user: auth._id, item: itemData._id, server: server })
      if(countBuy >= shopData.limit) throw `Bạn đã đạt giới hạn mua lại vật phẩm này`
    }

    // Send Item To Game
    if(itemType == 'game_recharge'){
      await gameSendRecharge(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        recharge_id: itemData.item_id,
        save_pay: shopData.price
      })
    }
    if(itemType == 'game_item'){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Shop',
        content: 'Vật phẩm mua từ Web Shop',
        items: [{ id: itemData.item_id, amount: parseInt(amount) * (shopData.item_amount || 1) }]
      })
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id },{
      $inc: {
        'currency.coin': totalPrice * -1,
        'spend.total.coin': totalPrice,
        'spend.day.coin': totalPrice,
        'spend.month.coin': totalPrice,
        'spend.total.count': 1,
        'spend.day.count': 1,
        'spend.month.count': 1,
      }
    })

    // History
    await DB.ShopHistory.create({
      user: auth._id,
      item: itemData._id,
      server: server,
      role: role,
      price: totalPrice,
      amount: parseInt(amount)
    })

    logUser(event, auth._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")}</b> để mua <b>x${amount} ${itemData.item_name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)

    if(itemType == 'game_recharge'){
      return resp(event, { message: 'Mua vật phẩm thành công', result: {
        account: auth.username,
        server_id: server,
        role_id: role,
        recharge_id: itemData.item_id,
        save_pay: shopData.price
      }})
    }
    else {
      return resp(event, { message: 'Mua vật phẩm thành công' })
    }
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})