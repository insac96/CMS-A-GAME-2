import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server, user } = await readBody(event)
    if(!server) throw 'Dữ liệu đầu vào sai'

    let account
    if(!!user){
      const userData = await DB.User.findOne({ _id: user }).select('username') as IDBUser
      if(!userData) throw 'Tài khoản không tồn tại'
      account = userData.username
    }

    const list = await gameGetRole(event, {
      server_id: server,
      account: !!account ? account : auth.username
    })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})