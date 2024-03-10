import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, secret } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
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

    const match : any = { }
    if(search.key){
      if(search.by == 'IP'){
        match['ip'] = { $regex : search.key, $options : 'i' }
      }
    }

    const logIP = await DB.LogUserIP.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          pipeline: [
            { $project: { username: 1 }}
          ],
          as: "user"
        }
      },
      { $unwind: { path: '$user'} },
      { $group: {
        _id: '$ip',
        users: { $push: '$user' },
        count: { $count: {} },
      }},
      {
        $lookup: {
          from: "block_ip_logs",
          localField: "_id",
          foreignField: "ip",
          as: "block"
        }
      },
      { $unwind: { path: '$block', preserveNullAndEmptyArrays: true }},
      { $project: { ip: '$_id', users: 1, count: 1, block: { $cond: [{$not: ["$block"]}, 0, 1]} }},
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
      list: logIP[0].list ? logIP[0].list : [],
      total: logIP[0].pagination ? (logIP[0].pagination[0] ? logIP[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})