import type { IAuth, IDBItem, IDBLimitedEventPayment, IDBUser } from '~~/types'

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server, role, payment } = await readBody(event)
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(!payment) throw 'Không tìm thấy ID mốc nhận'

    // Event
    const eventData = await DB.LimitedEventPayment
    .findOne({ _id: payment })
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    })
    .select('-createdAt -updateAt') as IDBLimitedEventPayment

    // Check Event
    if(!eventData) throw 'Mốc thưởng không tồn tại'
    if(eventData.gift.length == 0) throw 'Mốc chưa có phần thưởng để nhận'

    // Check Active
    const user = await DB.User.findOne({ _id: auth._id }).select('limitedevent') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const { day, receive } = user.limitedevent.payment
    if(day < eventData.need) throw 'Bạn chưa đạt điều kiện để nhận mốc thưởng'
    if(receive >= eventData.need) throw 'Bạn đã nhận mốc thưởng này rồi'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    eventData.gift.forEach(gift => {
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
        server_id: server,
        role_id: role,
        title: 'Liên Nạp',
        content: 'Vật phẩm nhận từ sự kiện liên nạp',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id }, {
      'limitedevent.payment.receive': eventData.need
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

    logUser(event, auth._id, `Nhận thưởng mốc <b>${eventData.need.toLocaleString('vi-VN')}</b> của sự kiện <b>liên nạp</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    if(change.length > 0) logUser(event, auth._id, `Nhận <b>${change.join(', ')}</b> từ mốc <b>${eventData.need.toLocaleString('vi-VN')}</b> của sự kiện <b>liên nạp</b>`)
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})