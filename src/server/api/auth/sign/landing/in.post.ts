import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { IDBConfig, IDBUser, IDBAdsLanding } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password, landing } = await readBody(event)
    if(!username || !password) throw 'Vui lòng điền đầy đủ thông tin thông tin'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('username password block type token') as IDBUser
    
    // Check User
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'

    // Check Config Enable
    const config = await DB.Config.findOne({}).select('enable') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(user.type < 1 && !config.enable.signin) throw 'Chức năng đăng nhập đang bảo trì'

    // Check Landing
    const landingData = await DB.AdsLanding.findOne({ _id: landing }).select('code') as IDBAdsLanding
    if(!landingData) throw 'Mã Landing không tồn tại'

    // Set Token and Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    // Save IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    const logIP = await DB.LogUserIP.findOne({ user: user._id, ip: IP })
    if(!logIP) await DB.LogUserIP.create({ user: user._id, ip: IP })

    // Update Landing
    await DB.AdsLanding.updateOne({ _id: landing }, { $inc: { 'sign.in': 1 }})

    // Update Ads From
    const adsFromCode = getCookie(event, 'ads-from')
    if(!!adsFromCode){
      const adsFromData = await DB.AdsFrom.findOne({ code: adsFromCode }).select('_id')
      if(!!adsFromData) await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'sign.in': 1 }})
      else deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    }

    // Send Notify And Save Log
    await sendNotifyUser(event, {
      to: [ user._id ],
      type: 3,
      color: 'blue',
      content: `Bạn đã đăng nhập với IP <b>${IP}</b>`
    })

    logUser(event, user._id, `Đăng nhập bằng Landing <b>${landingData.code}</b> với IP <b>${IP}</b>`)
    await createChat(event, 'bot', `<b>${user.username}</b> vừa truy cập`, true)

    return resp(event, { message: 'Đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})