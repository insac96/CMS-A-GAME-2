import { Types } from "mongoose"
import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, user, secret } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    let auth : IAuth | null = null
    let userCheck = null
    if(!secret){
      auth = await getAuth(event) as IAuth
      userCheck = !!user ? user : auth._id
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
      userCheck = user
    }

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: new Types.ObjectId(userCheck) }

    const histories = await DB.DiceHistory
    .aggregate([
      { $match: match },
      {
        $project: {
          dices: 1,
          play: '$coin.play',
          receive: '$coin.receive',
          jar: '$coin.jar',
          createdAt: 1
        }
      },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: histories[0].list ? histories[0].list : [],
      total: histories[0].pagination ? (histories[0].pagination[0] ? histories[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})