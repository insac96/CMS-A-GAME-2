import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const list = await DB.LimitedEventEgg
    .aggregate([
      {
        $lookup: {
          from: "items",
          localField: "row1.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "row1Data"
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "row2.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "row2Data"
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "row3.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "row3Data"
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "row4.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "row4Data"
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "row5.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "row5Data"
        }
      },
      { 
        $addFields: {
          row1: {
            $map: {
              input: '$row1Data',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$row1', { $indexOfArray: ['$row1.item', '$$this._id']} ]
                    }
                  }
                },
                percent: { 
                  $getField: {
                    field: 'percent',
                    input: {
                      $arrayElemAt: [ '$row1', { $indexOfArray: ['$row1.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          },
          row2: {
            $map: {
              input: '$row2Data',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$row2', { $indexOfArray: ['$row2.item', '$$this._id']} ]
                    }
                  }
                },
                percent: { 
                  $getField: {
                    field: 'percent',
                    input: {
                      $arrayElemAt: [ '$row2', { $indexOfArray: ['$row2.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          },
          row3: {
            $map: {
              input: '$row3Data',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$row3', { $indexOfArray: ['$row3.item', '$$this._id']} ]
                    }
                  }
                },
                percent: { 
                  $getField: {
                    field: 'percent',
                    input: {
                      $arrayElemAt: [ '$row3', { $indexOfArray: ['$row3.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          },
          row4: {
            $map: {
              input: '$row4Data',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$row4', { $indexOfArray: ['$row4.item', '$$this._id']} ]
                    }
                  }
                },
                percent: { 
                  $getField: {
                    field: 'percent',
                    input: {
                      $arrayElemAt: [ '$row4', { $indexOfArray: ['$row4.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          },
          row5: {
            $map: {
              input: '$row5Data',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$row5', { $indexOfArray: ['$row5.item', '$$this._id']} ]
                    }
                  }
                },
                percent: { 
                  $getField: {
                    field: 'percent',
                    input: {
                      $arrayElemAt: [ '$row5', { $indexOfArray: ['$row5.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          }
        } 
      },
      {
        $project: {
          row1Data: 0, row2Data: 0, row3Data: 0, row4Data: 0, row5Data: 0, 
        }
      }
    ])

    if(!list[0]) throw 'Không tìm thấy cấu hình'
    return resp(event, { result: list[0] })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})