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

    const list = await DB.Level
    .aggregate([
      {
        $lookup: {
          from: "items",
          localField: "gift_invited.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "giftdata"
        }
      },
      { 
        $addFields: {
          gift_invited: {
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
                      $arrayElemAt: [ '$gift_invited', { $indexOfArray: ['$gift_invited.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          }
        } 
      },
      { $project: { giftdata: 0, createdAt: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Level.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})