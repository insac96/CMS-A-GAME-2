export default defineEventHandler(async (event) => {
  try {
    const list = await DB.ItemBox
    .aggregate([
      {
        $lookup: {
          from: "items",
          localField: "gift.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_id: 1, item_name: 1, item_image: 1, type: 1 },
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
                item_id: '$$this.item_id',
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
      { $project: { giftdata: 0, createdAt: 0, updatedAt: 0 }}
    ])

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})