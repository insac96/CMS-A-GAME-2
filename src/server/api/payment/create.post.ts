import md5 from "md5"
import type { IAuth, IDBConfig, IDBGate, IDBLevel, IDBPaymentConfig, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { gate, card, money } = body
    if(!gate || !card) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(money)) || parseInt(money) < 1) throw 'Số tiền không hợp lệ'
    if(parseInt(money) < 20000) throw 'Số tiền phải lớn hơn hoặc bằng 20.000đ'
    if(parseInt(money) % 10000 != 0) return 'Số tiền phải là bội số của 10.000'
    if(parseInt(money) > 50000000) throw 'Số tiền nhập vào quá lớn'

    // Config
    const config = await DB.Config.findOne({}).select('short_name') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    // Payment Config
    const paymentConfig = await DB.PaymentConfig.findOne() as IDBPaymentConfig
    if(!paymentConfig) throw 'Không tìm thấy cấu hình cổng nạp'
    if(!!paymentConfig.maintenance) throw 'Chức năng nạp tiền đang bảo trì, vui lòng quay lại sau'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('level pay') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('limit.pay') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Check Count Waiting
    // const countWait = await DB.Payment.count({ user: user._id, status: 0 })
    // if(countWait > 0) throw 'Bạn đang có giao dịch nạp tiền chưa hoàn thành, vui lòng hủy nó trước nếu bạn chưa thực hiện'

    // Check Limit
    const pay = user.pay
    const limit = level.limit.pay
    const limitMoneyDay = limit.day.money == 0 ? -1 : (limit.day.money - pay.day.money) < 0 ? 0 : (limit.day.money - pay.day.money)
    const limitCountyDay = limit.day.count == 0 ? -1 : (limit.day.count - pay.day.count) < 0 ? 0 : (limit.day.count - pay.day.count)
    const limitMoneyMonth = limit.month.money == 0 ? -1 : (limit.month.money - pay.month.money) < 0 ? 0 : (limit.month.money - pay.month.money)
    const limitCountMonth = limit.month.count == 0 ? -1 : (limit.month.count - pay.month.count) < 0 ? 0 : (limit.month.count - pay.month.count)
  
    if(limitCountyDay != -1 && limitCountyDay <= 0) throw 'Bạn đã hết lượt nạp tiền hôm nay'
    if(limitMoneyDay != -1 && limitMoneyDay <= 0) throw 'Bạn đã đạt giới hạn nạp tiền hôm nay'
    if(limitMoneyDay != -1 && parseInt(money) > limitMoneyDay) throw `Hôm nay bạn chỉ có thể nạp tối đa ${limitMoneyDay.toLocaleString("vi-VN")}đ`
    if(limitCountMonth != -1 && limitCountMonth <= 0) throw 'Bạn đã hết lượt nạp tiền tháng này'
    if(limitMoneyMonth != -1 && limitMoneyMonth <= 0) throw 'Bạn đã đạt giới hạn nạp tiền tháng này'
    if(limitMoneyMonth != -1 && parseInt(money) > limitMoneyMonth) throw `Tháng này bạn chỉ có thể nạp tối đa ${limitMoneyMonth.toLocaleString("vi-VN")}đ`

    // Check Gate
    const gateSelect = await DB.Gate
    .findOne({ _id: gate })
    .select('name number person type key qrcode callback display') as IDBGate
    if(!gateSelect) throw 'Kênh nạp không tồn tại'
    if(gateSelect.display < 1) throw 'Kênh nạp đang bảo trì'

    // Make Code, Token
    const countPayment = await DB.Payment.count()
    const prefix = config.short_name ? config.short_name.trim().toUpperCase() : 'PAY'
    const code = prefix + (countPayment > 9 ? countPayment : `0${countPayment}`) + Math.floor(Math.random() * (99 - 10) + 10)
    const token = md5(`${code}-${Date.now()}`)
    
    // Make QR
    let qrcode
    if(!!gateSelect.qrcode && gateSelect.type != 1){
      qrcode = gateSelect.qrcode
      qrcode = qrcode.replaceAll('[money]', String(parseInt(money)))
      qrcode = qrcode.replaceAll('[code]', code)
      qrcode = qrcode.replaceAll('[token]', token)
      qrcode = qrcode.replaceAll('[gate-name]', gateSelect.name)
      qrcode = qrcode.replaceAll('[gate-number]', gateSelect.number)
      qrcode = qrcode.replaceAll('[gate-person]', gateSelect.person)
    }

    // Check Card
    if(gateSelect.type == 1){
      if(!gateSelect.key) throw 'Kênh thẻ cào đang bảo trì'
      if(!card.net || !card.seri || !card.pin) throw 'Thông tin thẻ cào không hợp lệ'

      await checkCard(event, {
        net: card.net,
        seri: card.seri,
        pin: card.pin,
        money: parseInt(money),
        token: token,
        key: gateSelect.key
      })
    }

    // Create
    const payment = await DB.Payment.create({
      user: auth._id,
      gate: gateSelect._id,
      card: card,
      money: parseInt(money),
      code: code,
      token: token,
      qrcode: qrcode
    })

    return resp(event, { message: 'Tạo giao dịch thành công', result: payment._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
