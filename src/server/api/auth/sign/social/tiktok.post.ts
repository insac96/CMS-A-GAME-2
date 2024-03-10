import jwt from 'jsonwebtoken'
import { IDBConfig, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { code, redirect_uri } = await readBody(event)
    if(!code || !redirect_uri) throw 'Không tìm thấy mã ủy quyền hoặc URL ủy quyền'

    // Get Config
    const config = await DB.Config.findOne().select('tiktok') as IDBConfig
    if(!config.tiktok.client_id || !config.tiktok.client_secret) throw 'Chức năng đăng nhập bằng Tiktok đang bảo trì'

    // Get Access Token
    const urlAccess = 'https://open.tiktokapis.com/v2/oauth/token/'
    const paramsAccess = new URLSearchParams()
    paramsAccess.append('client_key', config.tiktok.client_id)
    paramsAccess.append('client_secret', config.tiktok.client_secret)
    paramsAccess.append('code', code)
    paramsAccess.append('grant_type', 'authorization_code')
    paramsAccess.append('redirect_uri', `${redirect_uri}`)

    let respAccess : any = await fetch(urlAccess, {
      method: 'POST',
      body: paramsAccess,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      }
    })
    respAccess = await respAccess.json()
    const { access_token, token_type } = respAccess
    if(!access_token || !token_type) throw 'Không thể lấy mã xác thực'

    // Get User Info
    const urlUserInfo = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_large_url,avatar_url_100,avatar_url'
    let respUserInfo : any = await fetch(urlUserInfo, {
      method: 'GET',
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    })
    respUserInfo = await respUserInfo.json()
    const { data } = respUserInfo
    if(!data || !data.user) throw 'Không thể lấy thông tin người dùng'
    const { open_id, avatar_url, avatar_url_100, avatar_large_url } = data.user

    // Get IP
    const IP = getRequestIP(event, { xForwardedFor: true })

    // Check User
    let typeSign
    let user = await DB.User.findOne({ 'social.tiktok': open_id }).select('block') as IDBUser

    if(!!user){
      if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'
      typeSign = 'in'
    } 

    // Create User
    if(!user){
      // Check IP
      const logIP = await DB.LogUserIP.count({ ip: IP })
      if(logIP > 30) throw 'IP đã vượt quá giới hạn tạo tài khoản'

      // Save User
      const avatar = avatar_large_url || avatar_url_100 || avatar_url || '/images/user/default.png'

      user = await DB.User.create({
        reg: { platform: 'tiktok' },
        social: { tiktok: open_id },
        avatar: avatar
      })

      // Save IP
      await DB.LogUserIP.create({ user: user._id, ip: IP })
      typeSign = 'up'
    }

    // Log And Notify
    if(typeSign == 'in'){
      logUser(event, user._id, `Đăng nhập với IP <b>${IP}</b>`)

      await sendNotifyUser(event, {
        to: [ user._id ],
        type: 3,
        color: 'blue',
        content: ` Bạn đã đăng nhập bằng <b>Tiktok</b> với IP <b>${IP}</b>`
      })
    }
    if(typeSign == 'up'){
      logUser(event, user._id, 'Đăng ký tài khoản')

      await sendNotifyUser(event, {
        to: [ user._id ],
        color: 'primary',
        content: `Chào mừng thành viên mới, chúc bạn chơi game vui vẻ`
      })
    }

    // Make Token
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    // Make Cookie
    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    return resp(event, { message: 'Xác thực thành công', result: token })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})