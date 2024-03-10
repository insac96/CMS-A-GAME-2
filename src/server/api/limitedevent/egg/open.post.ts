import type { IAuth, IDBItem, IDBLimitedEventEgg, IDBUser } from '~~/types'
import type { Types } from 'mongoose'

interface IGiftEggData {
  item: Types.ObjectId | IDBItem,
  amount: number
  percent: number
}

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

const getRandomGift = (list : Array<IGiftEggData>) : IGiftEggData => {
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

    const { server, role, row, index } = await readBody(event)
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(row < 1 || row > 5) throw 'Dữ liệu hàng không hợp lệ'
    if(index < 0 || index > 4 || (parseInt(index) + 1 > row)) throw 'Dữ liệu vị trí không hợp lệ'

    // Event
    const rowSelect = parseInt(row)
    const rowDown = parseInt(row) + 1
    const rowUp = parseInt(row) - 1
    const eventData = await DB.LimitedEventEgg
    .findOne()
    .select(`price${rowSelect} row${rowSelect}`) as IDBLimitedEventEgg

    // Check Event
    if(!eventData) throw 'Cấu hình không tồn tại'

    const price = eventData[`price${rowSelect}`]
    if(!price) throw 'Không tìm thấy giá xu đập trứng'

    const gift = eventData[`row${row}`]
    if(gift.length == 0) throw 'Trứng chưa có phần thưởng để đập'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin limitedevent.egg') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.coin < price) throw 'Số dư xu không đủ để đập trứng'

    // @ts-expect-error
    const userEggRowSelect = user.limitedevent.egg[rowSelect]
    // @ts-expect-error
    const userEggRowDown = user.limitedevent.egg[rowDown]
    // @ts-expect-error
    const userEggRowUp = user.limitedevent.egg[rowUp]
    
    // Check Row
    if(!userEggRowSelect) throw 'Dữ liệu hàng tài khoản không hợp lệ'

    // Check Index
    const hasIndex = userEggRowSelect.find((i : any) => i.index == index)
    if(!!hasIndex) throw 'Vị trí này đã được đập'

    // Check Down And Up
    if(!!userEggRowDown && userEggRowDown.length != rowDown) throw 'Vui lòng đập hết trứng hàng dưới trước'
    if(userEggRowSelect.length == rowSelect){
      if(!!userEggRowUp) throw 'Vui lòng đập trứng hàng trên'
      else 'Bạn đã đập hết số trứng trong sự kiện này'
    }

    // Get Random Gift
    const resultGift = getRandomGift(gift)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

    // Send Item
    const item = await DB.Item.findOne({ _id: resultGift.item }) as IDBItem

    if(item.type == 'game_item'){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Quà Đập Trứng May Mắn',
        content: 'Vật phẩm nhận từ đập trứng may mắn',
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

    // Log User
    if(item.type == 'coin'){
      logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> xu từ <b>đập trứng may mắn</b>`)
    }
    else if(item.type == 'wheel'){
      logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> lượt quay từ <b>đập trứng may mắn</b>`)
    }
    else if(item.type == 'notify'){
      logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> lượt gửi thông báo từ <b>đập trứng may mắn</b>`)
    }
    else {
      logUser(event, auth._id, `Nhận quà từ <b>đập trứng may mắn</b>`)
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { 
      $inc: { 'currency.coin':  price * -1 }
    })

    // @ts-expect-error
    user.limitedevent.egg[rowSelect].push({
      item: item._id,
      amount: resultGift.amount,
      index: index
    })
    await user.save()

    // Result
    const result = JSON.parse(JSON.stringify(item))
    result.amount = resultGift.amount

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})