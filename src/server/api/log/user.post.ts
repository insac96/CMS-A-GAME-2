import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, user, secret } = await readBody(event)
    if(!size || !current || !user) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    if(!secret){
      const auth = await getAuth(event) as IAuth
      if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
    }

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: user }

    const list = await DB.LogUser
    .find(match)
    .select('action createdAt')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.LogUser.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})