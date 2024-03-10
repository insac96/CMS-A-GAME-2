import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, type, user } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!type) {
      match['type'] = type
    }
    if(!!user) {
      const users = await DB.User.find({
        username : { $regex : user.toLowerCase(), $options : 'i' }
      }).select('_id')

      match['user._id'] = {
        $in: users.map(i => i._id)
      }
    }

    const histories = await DB.EventHistory
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          pipeline: [{
            $project: {
              username: 1
            },
          }],
          as: "user"
        }
      },
      { $unwind: { path: '$user' }},
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