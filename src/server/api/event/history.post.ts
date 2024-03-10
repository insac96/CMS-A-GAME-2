import { Types } from "mongoose"
import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, type, user, secret } = await readBody(event)
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
    if(!!type) {
      match['type'] = type
    }

    const histories = await DB.EventHistory
    .aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          pipeline: [{
            $project: {
              type: 1, need: 1
            },
          }],
          as: "event"
        }
      },
      { $unwind: { path: '$event' }},
      {
        $project: {
          user: 1,
          type: '$event.type',
          need: '$event.need',
          server: 1,
          createdAt: 1
        }
      },
      { $match: match },
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