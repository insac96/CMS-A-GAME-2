import type { IDBItem, IDBGiftcode, IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { code, server_id } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã Giftcode'

    // Giftcode
    const giftcodeData = await DB.Giftcode
    .findOne({ code: code.toUpperCase(), display: 1 })
    .populate({
      path: 'gift.item',
      select: 'item_name item_image type'
    })
    .select('-createdAt -updateAt -display') as IDBGiftcode

    // Check Giftcode
    if(!giftcodeData) throw 'Mã không tồn tại'
    if(giftcodeData.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'

    // Check Limit
    if(giftcodeData.limit > 0){
      const countReceive = await DB.GiftcodeHistory.count({ giftcode: giftcodeData._id })
      if(countReceive >= giftcodeData.limit) throw 'Mã này đã hết lượt sử dụng'
    }

    // Check Received
    const countReceiveAuth = await DB.GiftcodeHistory.count({ user: auth._id, giftcode: giftcodeData._id })
    if(countReceiveAuth > 0) throw 'Bạn đã nhận mã này rồi'

    // Result
    const resultGiftcode : any = JSON.parse(JSON.stringify(giftcodeData))
    resultGiftcode.gift = giftcodeData.gift.map(gift => ({
      name: (gift.item as IDBItem).item_name,
      image: (gift.item as IDBItem).item_image,
      type: (gift.item as IDBItem).type,
      amount: gift.amount
    }))

    const result = {
      giftcode: resultGiftcode,
      server: server_id
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})