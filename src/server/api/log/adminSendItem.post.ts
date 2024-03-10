import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, from, to, secret } = await readBody(event)
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

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!from){
      const users = await DB.User.find({
        username : { $regex : from.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['from'] = {
        $in: users.map(i => i._id)
      }
    }
    if(!!to){
      const users = await DB.User.find({
        username : { $regex : to.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['to'] = {
        $in: users.map(i => i._id)
      }
    }

    const list = await DB.LogAdminSendItem
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 },
          }],
          as: "from"
        }
      },
      { $unwind: { path: '$from', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 },
          }],
          as: "to"
        }
      },
      { $unwind: { path: '$to', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "items",
          localField: "gift.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "giftdata"
        }
      },
      { 
        $addFields: {
          gift: {
            $map: {
              input: '$giftdata',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$gift', { $indexOfArray: ['$gift.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          }
        } 
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.LogAdminSendItem.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})