import type { IDBUser, IDBLevel, IDBWheel, IDBItem, IAuth } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel'
]

const getRandomGift = (list : Array<IDBWheel>) : IDBWheel => {
  // Get Random
  let totalPercent = 0
  let rand = 0

  totalPercent = list.reduce((accumulator, object) => {
    return parseFloat(String(accumulator)) + parseFloat(String(object.percent))
  }, 0)
  totalPercent = totalPercent
  rand = Math.random() * totalPercent

  // Get Chances
  const chances : Array<number> = []
  let acc = 0
  list.forEach(i => {
    acc = parseFloat(String(acc)) + (parseFloat(String(i.percent)))
    chances.push(acc)
  })

  // Get Index
  let index : number = 0
  chances.forEach(i => {
    if(i <= rand){
      index = index + 1
    }
  })

  return list[index]
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { server, role, times } = body
    if(!server || !role || !!isNaN(parseInt(times)) || parseInt(times) < 1 || parseInt(times) > 10) throw 'Dữ liệu đầu vào sai'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.wheel level wheel') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.wheel < times) throw 'Bạn đã hết lượt quay'
    const level = await DB.Level.findOne({ _id: user.level }).select('limit.wheel') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Check Limit
    const wheelUser = user.wheel
    const limit = level.limit.wheel
    const limitDay = limit.day == 0 ? -1 : (limit.day - wheelUser.day) < 0 ? 0 : (limit.day - wheelUser.day)
    const limitMonth = limit.month == 0 ? -1 : (limit.month - wheelUser.month) < 0 ? 0 : (limit.month - wheelUser.month)
    if(limitDay != -1 && limitDay <= 0) throw 'Bạn đã hết lượt chơi hôm nay'
    if(limitMonth != -1 && limitMonth <= 0) throw 'Bạn đã hết lượt chơi tháng này'

    // List Gift
    const list = await DB.Wheel
    .find({ display: 1})
    .select('item amount percent updatedAt')
    .sort({ updatedAt: -1 })
    .limit(10) as Array<IDBWheel>
    if(list.length == 0) throw 'Vòng quay hiện chưa có phần thưởng để bắt đầu'


    // Rand Spin
    const resultListGift = []
    for(let i = 0; i < times; i++){
      // Get Random Gift
      const resultGift = getRandomGift(list)
      if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

      // Send Item
      const item = await DB.Item.findOne({ _id: resultGift.item }).select('item_id item_name type') as IDBItem

      if(item.type == 'game_item'){
        await gameSendMail(event, {
          account: auth.username,
          server_id: server,
          role_id: role,
          title: 'Web Wheel Lucky',
          content: 'Vật phẩm nhận từ vòng quay may mắn trên Web',
          items: [{ 
            id: item.item_id, 
            amount: resultGift.amount 
          }]
        })
      }

      if(!!currencyTypeList.includes(item.type)){
        await DB.User.updateOne({ _id: auth._id }, {
          $inc: {
            [`currency.${item.type}`]: resultGift.amount 
          }
        })
      }

      // History
      await DB.WheelHistory.create({
        user: auth._id,
        server: server,
        role: role,
        item: item._id,
        amount: resultGift.amount,
        percent: resultGift.percent
      })

      // Log User
      if(item.type == 'coin'){
        logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> xu từ <b>vòng quay may mắn</b>`)
      }
      if(item.type == 'wheel'){
        logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> lượt quay từ <b>vòng quay may mắn</b>`)
      }

      // Lucky User
      if(item.type != 'wheel_lose' && resultGift.percent <= 5){
        await DB.WheelLuckyUser.create({
          user: auth._id,
          action: `<b>x ${resultGift.amount.toLocaleString('vi-VN')} ${item.item_name}</b>`
        })
      }

      // Update List
      resultListGift.push(resultGift)
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { 
      $inc: { 
        'currency.wheel': parseInt(times) * -1,
        'wheel.total': parseInt(times),
        'wheel.day': parseInt(times),
        'wheel.month': parseInt(times),
      }
    })

    return resp(event, { result: resultListGift[resultListGift.length - 1]._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})