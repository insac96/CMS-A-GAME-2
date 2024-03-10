import type { IAuth, IDBLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

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
    .populate({ path: 'gift_invited.item', select: 'item_name item_image type' }) as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ người giới thiệu bạn'
    if(level.gift_invited.length == 0) throw 'Hiện tại phần quà chưa khả dụng, vui lòng quay lại sau'

    const gift_invited = level.gift_invited.map((i : any) => ({
      _id: i._id,
      name: i.item.item_name,
      image: i.item.item_image,
      type: i.item.type,
      amount: i.amount
    }))

    return resp(event, { result: gift_invited })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})