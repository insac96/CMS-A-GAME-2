

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(search){
      match['name'] = { $regex : search, $options : 'i' }
    }
    
    const shopPack = await DB.ShopPack
    .aggregate([
      { 
        $match: { 
          $and: [
            { display: 1 }, 
            {'gift.0': { $exists: true } } 
          ]
        }
      },
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
          name: 1, 
          price: 1,
          pin: 1,
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
      list: shopPack[0].list ? shopPack[0].list : [],
      total: shopPack[0].pagination ? (shopPack[0].pagination[0] ? shopPack[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})