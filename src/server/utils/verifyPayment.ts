import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import { IDBConfig, IDBGate, IDBLevel, IDBPayment, IDBPaymentConfig, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, money, reason } : IBodyData, 
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 2
  ) throw 'Mã trạng thái không hợp lệ'
  if(
    !!isNaN(parseInt(String(money))) 
    || parseInt(String(money)) < 0 
  ) throw 'Số tiền không hợp lệ'
  if(status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Config
  const webConfig = await DB.Config.findOne().select('enable') as IDBConfig
  const paymentConfig = await DB.PaymentConfig.findOne() as IDBPaymentConfig

  // Set Real Value
  let realNotify
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Payment
  const payment = await DB.Payment
  .findOne({ _id: _id })
  .select('code gate user status')
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const user = await DB.User.findOne({ _id: payment.user }).select('level referral limitedevent') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'
  const level = await DB.Level.findOne({ _id: user.level }).select('bonus bonus_wheel') as IDBLevel
  if(!level) throw 'Không tìm thấy thông tin cấp độ tài khoản'
  const gate = await DB.Gate.findOne({ _id: payment.gate }).select('bonus') as IDBGate
  if(!gate) throw 'Không tìm thấy thông tin kênh nạp'

  // Set Verify Person
  let verify_person
  if(!!verifier){
    verify_person = verifier
  }
  else {
    const bot = await DB.User.findOne({'username': 'bot'}).select('_id')
    verify_person = bot._id
  }

  // Get Last Payment
  const lastPaymentDone = await DB.Payment
  .findOne({ user: user._id, status: 1 })
  .select('verify')
  .sort({ 'verify.time' : -1 })
  .limit(1) as IDBPayment
  
  // Update Payment
  const time = new Date()
  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })

  // Check Status
  if(realStatus == 1){
    // Bonus Coin
    const levelBonus = parseInt(String(level.bonus))
    const gateBonus = getGateBonus(event, gate.bonus)
    const bonus = Math.floor(realMoney * ((levelBonus + gateBonus) / 100))
    const coin = realMoney + bonus

    // Bonus Save Pay
    let bonusSavePay = 0
    if(!!paymentConfig){
      const limitBonusSavePay = parseInt(String(paymentConfig.pay.number || 0))
      const limitExpiredBonusSavePay = paymentConfig.pay.expired

      if(!limitExpiredBonusSavePay) bonusSavePay = limitBonusSavePay
      else {
        const nowTime = DayJS().unix()
        const expiredTime = DayJS(limitExpiredBonusSavePay).unix()
        if(nowTime <= expiredTime) bonusSavePay = limitBonusSavePay
      }
    }
    bonusSavePay = Math.floor(realMoney * (bonusSavePay / 100))

    // Bonus Wheel
    let bonusWheel : number = 0
    const percentBonusWheel = parseInt(String(level.bonus_wheel))
    if(percentBonusWheel > 0) bonusWheel = Math.floor(realMoney / percentBonusWheel)

    // Update User
    await DB.User.updateOne({ _id: payment.user },{
      $inc: {
        'currency.coin': coin,
        'currency.wheel': bonusWheel,
        'pay.total.money': realMoney,
        'pay.day.money': realMoney + bonusSavePay,
        'pay.month.money': realMoney + bonusSavePay,
        'pay.total.count': 1,
        'pay.day.count': 1,
        'pay.month.count': 1,
      }
    })

    realNotify = `
      Bạn được duyệt thành công giao dịch 
      <b>${payment.code}</b> 
      với số tiền 
      <b>${realMoney.toLocaleString('vi-VN')} VNĐ</b> 
      nhận được <b>${coin.toLocaleString('vi-VN')} xu</b>
      từ tiền nạp 
      + <b>${levelBonus}%</b> thưởng cấp độ 
      + <b>${gateBonus}%</b> khuyến mại kênh nạp
    `
    logUser(event, user._id, `Nhận <b>${coin.toLocaleString('vi-VN')} xu, ${bonusWheel.toLocaleString('vi-VN')} lượt quay</b> từ giao dịch nạp tiền thành công <b>${payment.code}</b>`)

    // Update Diamond Referraler
    if(!!user.referral.person){
      const referraler = await DB.User
      .findOne({ _id: user.referral.person })
      .select('level username')
      .populate({ path: 'level', select: 'bonus_presentee_pay' }) as IDBUser

      if(!!referraler){
        const diamondBonus = parseInt(String((referraler.level as IDBLevel).bonus_presentee_pay || 0))
        if(diamondBonus > 0){
          const diamond = Math.floor(realMoney * (diamondBonus / 100))

          await DB.User.updateOne({ _id: referraler._id },{ $inc: { 'currency.diamond': diamond }})
          logUser(event, user._id, `Nhận được <b>${diamond.toLocaleString('vi-VN')} Cống Hiến</b> từ giao dịch nạp tiền <b>${payment.code}</b> của bạn bè <b>${referraler.username}</b>`)
          await sendNotifyUser(event, {
            to: [ referraler._id ],
            type: 2,
            color: 'primary',
            content: `Bạn nhận được <b>${diamond.toLocaleString('vi-VN')} Cống Hiến</b> từ giao dịch nạp tiền của bạn bè <b>${referraler.username}</b>`
          })
        }
      }
    }

    // Update Limited Event Payment
    if(!!webConfig.enable.limitedevent){
      // Payment
      if(user.limitedevent.payment.day == 0) user.limitedevent.payment.day = 1
      else {
        if(!lastPaymentDone) user.limitedevent.payment.day = 1
        else {
          const payNowTime = formatDate(event, time)
          const payLastTime = formatDate(event, lastPaymentDone.verify.time)

          if(
            payNowTime.day != payLastTime.day 
            || payNowTime.month != payLastTime.month 
            || payNowTime.year !=  payLastTime.year
          ){
            const nowStart = payNowTime.dayjs.startOf('day').unix()
            const lastStart = payLastTime.dayjs.startOf('day').unix()
            
            if((nowStart - lastStart) > (24 * 60 * 60)){
              user.limitedevent.payment.day = 1
              user.limitedevent.payment.receive = 0
            }
            else {
              user.limitedevent.payment.day = user.limitedevent.payment.day + 1
            }
          }
        }
      }

      // Mission
      const mission = await DB.LimitedEventPayMission.findOne({ need: money })
      if(!!mission){
        const missionCheck = user.limitedevent.paymission.find(i => i.money == money)
        if(!missionCheck){
          user.limitedevent.paymission.push({
            money: money,
            receive: false
          })
        }
      }

      // Save
      await user.save()
    }

    if(!!verifier) return logAdmin(event, `Chấp nhận giao dịch nạp tiền <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verifier)
  }
  else {
    realNotify = `Bạn bị từ chối giao dịch <b>${payment.code}</b> với lý do <b>${realReason}</b>`
    if(!!verifier) return logAdmin(event, `Từ chối giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verifier)
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser(event, {
    to: [ payment.user ],
    type: 2,
    color: realStatus == 1 ? 'green' : 'red',
    content: realNotify
  })
}