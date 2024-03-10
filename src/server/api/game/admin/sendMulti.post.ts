import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { items, roles, title, content, reason } = body
    if(roles.length < 1) throw 'Dữ liệu nhân vật không hợp lệ'
    if(items.length < 1) throw 'Dữ liệu vật phẩm không hợp lệ'

    const itemLog = items.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))

    const itemSend = items.map((i : any) => ({
      id: i.item_id,
      amount: i.amount
    }))

    roles.forEach(async (data : any) => {
      const user = data.user
      const server = data.server
      const role = data.role

      await gameSendMail(event, {
        account: user.username,
        server_id: server.server_id,
        role_id: role.role_id,
        title: title || 'GM Send',
        content: content || 'Vật phẩm gửi từ GM',
        items: itemSend
      })
  
      await DB.LogAdminSendItem.create({
        from: auth._id,
        to: user._id,
        server: server.server_id,
        role: role.role_id,
        reason: reason,
        gift: itemLog
      })
  
      logUser(event, user._id, `Nhận <b>vật phẩm</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
      logAdmin(event, `Gửi vật phẩm cho <b>${user.username}</b> tại máy chủ <b>${server}</b> với lý do <b>${reason}</b>`)
    })

    return resp(event, { message: 'Gửi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})