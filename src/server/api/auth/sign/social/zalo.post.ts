import jwt from 'jsonwebtoken'
import { IDBConfig, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { code, redirect_uri } = await readBody(event)
    if(!code || !redirect_uri) throw 'Không tìm thấy mã ủy quyền hoặc URL ủy quyền'

    // Get Config
    const config = await DB.Config.findOne().select('zalo') as IDBConfig
    if(!config.zalo.client_id || !config.zalo.client_secret) throw 'Chức năng đăng nhập bằng Zalo đang bảo trì'

    // Get Access Token
    const urlAccess= 'https://oauth.zaloapp.com/v4/access_token'
    const paramsAccess = new URLSearchParams()
    paramsAccess.append('app_id', config.zalo.client_id)
    paramsAccess.append('code', code)
    paramsAccess.append('grant_type', 'authorization_code')

    let respAccess : any = await fetch(urlAccess, {
      method: 'POST',
      body: paramsAccess,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'secret_key': config.zalo.client_secret
      }
    })
    respAccess = await respAccess.json()
    const { access_token } = respAccess
    if(!access_token) throw 'Không thể lấy mã xác thực'

    // Get User Info
    const urlUserInfo = 'https://graph.zalo.me/v2.0/me?fields=id,name,picture'
    let respUserInfo : any = await fetch(urlUserInfo, {
      method: 'GET',
      headers: {
        'access_token': access_token
      }
    })
    respUserInfo = await respUserInfo.json()
    const { id } = respUserInfo
    if(!id) throw 'Không thể lấy thông tin người dùng'

    // Get IP
    const IP = getRequestIP(event, { xForwardedFor: true })

    // Check User
    let typeSign
    let user = await DB.User.findOne({ 'social.zalo': id }).select('block') as IDBUser
    
    // If Has User
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
      const picture = respUserInfo.picture
      const avatar = (!!picture && !!picture['data'] && !!picture['data']['url']) ? picture['data']['url'] : '/images/user/default.png'
      user = await DB.User.create({
        reg: { platform: 'tiktok' },
        social: { zalo: id },
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
        content: ` Bạn đã đăng nhập bằng <b>Zalo</b> với IP <b>${IP}</b>`
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