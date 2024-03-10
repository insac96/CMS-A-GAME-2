import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    if(!!search){
      match['code'] = { $regex : search, $options : 'i' }
    }

    const list = await DB.AdsLanding
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "reg.landing",
          pipeline: [{
            $project: {
              pay: '$pay.total.money'
            },
          }],
          as: "users"
        }
      },
      { 
        $addFields: { 
          pay: { $sum: '$users.pay' }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.AdsLanding.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})