import type { IDBUser, IDBLevel, IDBItem, IAuth } from '~~/types'

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server, role } = await readBody(event)
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    const user = await DB.User.findOne({ _id: auth._id }).select('referral') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.referral.receive_gift > 0) throw 'Bạn đã nhận phần thưởng này rồi'

    const referraler = await DB.User
    .findOne({ _id: user.referral.person })
    .select('level') as IDBUser
    if(!referraler) throw 'Không tìm thấy thông tin người giới thiệu bạn'

    const level = await DB.Level
    .findOne({ _id: referraler.level })
    .select('number gift_invited')
    .populate({ path: 'gift_invited.item', select: 'item_id type' }) as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ người giới thiệu bạn'
    if(level.gift_invited.length == 0) throw 'Hiện tại phần quà chưa khả dụng, vui lòng quay lại sau'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    level.gift_invited.forEach(gift => {
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
        title: 'Web Gift Box',
        content: 'Vật phẩm nhận từ người giới thiệu',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }
    
    // History
    await DB.User.updateOne({ _id: auth._id }, { 'referral.receive_gift' : 1})

    // Log User
    logUser(event, auth._id, `Nhận <b>quà của người giới thiệu</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    if(!!giftCurrency[`currency.coin`] && giftCurrency[`currency.coin`] > 0){
      logUser(event, auth._id, `Nhận <b>${giftCurrency[`currency.coin`].toLocaleString('vi-VN')}</b> xu từ <b>quà của người giới thiệu</b>`)
    }
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})