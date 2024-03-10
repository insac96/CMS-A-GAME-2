import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, user } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: !!user ? user : auth._id }
    if(search.key && search.by){
      match['$text'] = { '$search': search.key }
    }

    const list = await DB.Withdraw
    .find(match)
    .select('code diamond status createdAt')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.Withdraw.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})