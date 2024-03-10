import type { IAuth, IDBGameRankGift, IDBItem } from "~~/types"

const typeName : any = {
  'level': 'cấp độ',
  'power': 'lực chiến'
}

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, role } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào sai'
    if(!role) throw 'Vui lòng chọn nhân vật'
    
    const rankgift = await DB.GameRankGift
    .findOne({ _id: _id })
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    }) as IDBGameRankGift

    if(!rankgift) throw 'Không tìm thấy thông tin phân thưởng thứ hạng'
    if(rankgift.gift.length < 1) throw 'Chúng tôi đang cập nhật phần thưởng, vui lòng nhận lại sau'

    // Kiểm tra thời gian được nhận
    const now = formatDate(event, new Date())
    const expired = formatDate(event, rankgift.expired)
    if(now.timestamp < expired.timestamp) throw 'Chưa đến thời gian được nhận thưởng'

    // Kiểm tra lịch sử nhận
    const countUserReceive = await DB.GameRankGiftHistory.count({ rankgift: rankgift._id, user: auth._id })
    if(countUserReceive > 0) throw 'Bạn đã nhận phần thưởng này rồi'

    const maxCountReceive = rankgift.end - rankgift.start + 1
    const countReceive = await DB.GameRankGiftHistory.count({ rankgift: rankgift._id })
    if(countReceive >= maxCountReceive) throw 'Phần thưởng hạng này đã có người nhận'

    // Lấy danh sách xếp hạng
    const rankList = rankgift.type == 'level' ? await gameGetRankLevel(event, {
      server_id: rankgift.server
    }, true) : await gameGetRankPower(event, {
      server_id: rankgift.server
    }, true)
    if(!rankList || rankList.length == 0) throw 'Không thể lấy thông tin bảng xếp hạng'

    // Kiểm tra nhân vật có trong bảng xếp hạng hay không
    const find = rankList.find((i : any) => i.role_id == role)
    if(!find) throw 'Nhân vật không có trong bảng xếp hạng, hãy cố gắng thêm chút nữa'
    if(find.rank < rankgift.start || find.rank > rankgift.end) throw 'Nhân vật đang không ở thứ hạng này'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    rankgift.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0){
      await gameSendMail(event, {
        account: auth.username,
        server_id: rankgift.server,
        role_id: role,
        title: 'Web Rank Gift',
        content: `Vật phẩm nhận từ quà xếp hạng ${typeName[rankgift.type]} trên WEB`,
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // History
    await DB.GameRankGiftHistory.create({
      rankgift: rankgift._id,
      user: auth._id,
      server: rankgift.server,
      role: role,
      rank: find.rank
    })

    // Log User
    const change : any = []
    if(!!giftCurrency[`currency.coin`] && giftCurrency[`currency.coin`] > 0){
      change.push(`${giftCurrency[`currency.coin`].toLocaleString('vi-VN')} xu`) 
    }
    if(!!giftCurrency[`currency.wheel`] && giftCurrency[`currency.wheel`] > 0){
      change.push(`${giftCurrency[`currency.wheel`].toLocaleString('vi-VN')} lượt quay`) 
    }
    if(!!giftCurrency[`currency.notify`] && giftCurrency[`currency.notify`] > 0){
      change.push(`${giftCurrency[`currency.notify`].toLocaleString('vi-VN')} lượt gửi thông báo`) 
    }

    logUser(event, auth._id, `Nhận quà xếp hạng <b>${typeName[rankgift.type]} ${find.rank}</b> tại máy chủ <b>${rankgift.server}</b> nhân vật <b>${role}</b>`)
    if(change.length > 0) logUser(event, auth._id, `Nhận <b>${change.join(', ')}</b> từ quà xếp hạng <b>${typeName[rankgift.type]} ${find.rank}</b>`)

    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})