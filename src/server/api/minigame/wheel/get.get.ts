export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Wheel
    .aggregate([
      { $match: { display: 1 } },
      { $sort: { updatedAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          pipeline: [{
            $project: {
              item_name: 1, item_image: 1, type: 1
            },
          }],
          as: "itemData"
        }
      },
      { $unwind: { path: '$itemData' }},
      { 
        $project: { 
          image: '$itemData.item_image',
          name: '$itemData.item_name',
          type: '$itemData.type',
          amount: 1
        }
      }
    ])

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})