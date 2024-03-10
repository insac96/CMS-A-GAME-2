import { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { user, server, role, title, content, reason, items } = body
    if(!user || !server || !role || !reason || !Array.isArray(items)) throw 'Dữ liệu đầu vào không hợp lệ'
    if(items.length < 1) throw 'Dữ liệu vật phẩm không hợp lệ'

    const userData = await DB.User.findOne({ _id: user }).select('_id username') as IDBUser
    if(!userData) throw 'Tài khoản không tồn tại'

    const itemLog = items.map(i => ({
      item: i._id,
      amount: i.amount
    }))

    const itemSend = items.map(i => ({
      id: i.item_id,
      amount: i.amount
    }))
    
    await gameSendMail(event, {
      account: userData.username,
      server_id: server,
      role_id: role,
      title: title || 'GM Send',
      content: content || 'Vật phẩm gửi từ GM',
      items: itemSend
    })

    await DB.LogAdminSendItem.create({
      from: auth._id,
      to: userData._id,
      server: server,
      role: role,
      reason: reason,
      gift: itemLog
    })

    logUser(event, userData._id, `Nhận <b>vật phẩm</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    logAdmin(event, `Gửi vật phẩm cho <b>${userData.username}</b> tại máy chủ <b>${server}</b> với lý do <b>${reason}</b>`)

    return resp(event, { message: 'Gửi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})