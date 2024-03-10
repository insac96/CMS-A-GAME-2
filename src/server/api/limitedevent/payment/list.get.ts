export default defineEventHandler(async (event) => {
  try {
    let list = await DB.LimitedEventPayment
    .aggregate([
      { $match: {'gift.0': { $exists: true } } },
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
          need: 1, 
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
      { $sort: { need: 1 } },
    ])

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})