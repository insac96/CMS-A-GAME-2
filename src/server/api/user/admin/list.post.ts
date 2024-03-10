import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, secret } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    if(!secret){
      const auth = await getAuth(event) as IAuth
      if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
    }

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!search.key){
      if(search.by == 'USER') match['username'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'MAIL') match['email'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'PHONE') match['phone'] = { $regex : search.key, $options : 'i' }
      if(search.by == 'IP') {
        const listIP = await DB.LogUserIP.find({
          ip: { $regex : search.key, $options : 'i' }
        }).select('user')

        match['_id'] = {
          $in: listIP.map(i => i.user)
        }
      }
    }

    const list = await DB.User
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "levels",
          localField: "level",
          foreignField: "_id",
          pipeline: [{
            $project: { number: 1 }
          }],
          as: "level"
        }
      },
      { $unwind: { path: "$level" } },
      { 
        $project: {
          username: 1, 
          email: 1,
          phone: 1,
          level: '$level.number',
          coin: '$currency.coin',
          wheel: '$currency.wheel',
          notify: '$currency.notify',
          diamond: '$currency.diamond',
          referral: '$referral.count',
          pay: '$pay.total.money',
          spend: '$spend.total.coin',
          login: '$login.total',
          ip: '$login.last_ip',
          pay_data: '$pay',
          spend_data: '$spend',
          wheel_data: '$wheel',
          dice_data: '$dice',
          login_data: '$login',
          type: 1,
          block: 1,
          createdAt: 1
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.User.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})