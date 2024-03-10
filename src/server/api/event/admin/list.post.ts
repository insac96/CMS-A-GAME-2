import type { IAuth, IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, type } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!type) throw 'Kiểu sự kiện không hỗ trợ'

    const eventConfig = await DB.EventConfig.findOne({ type: type }).select('_id') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { type: type }

    const list = await DB.Event
    .aggregate([
      { $match: match },
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
        $project: {
          need: 1, display: 1, updatedAt: 1,
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

    const total = await DB.Event.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})