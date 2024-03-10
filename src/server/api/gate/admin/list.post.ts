import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.Gate
    .aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "gate",
          pipeline: [{
            $project: {
              money: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            },
          }],
          as: "payments"
        }
      },
      { 
        $addFields: { 
          bonus_default: '$bonus.default',
          bonus_limit: '$bonus.limit.number',
          bonus_limit_expired: '$bonus.limit.expired',
          payment_count: { $size: '$payments' },
          payment_money: { $sum: '$payments.money' }
        }
      },
      { $project: { payments: 0, createdAt: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Gate.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})