import { Types } from 'mongoose'
import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { type, page } = await readBody(event)
    if(!page) throw 'Thiếu dữ liệu phân trang'

    const { size, current, sort } = page
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.by || !sort.index) throw 'Dữ liệu sắp xếp sai'

    // Make Filter
    const filter : any = {
      $or: [
        { to: { $elemMatch: { user: auth._id }}  },
        { global: 1 }
      ]
    }
    if(type != undefined) filter['type'] = Number(type)

    // Make Sort
    const sorting : any = { pin: -1 }
    sorting[sort.by] = Number(sort.index)
    
    // Get Notify
    const notifies = await DB.NotifyUser.aggregate([
      { $match : filter },
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'from'
        }
      },
      { $unwind: { path: "$from" } },
      {
        $project : {
          type:1, color:1, title:1, content:1, link:1, pin:1, global:1, createdAt:1,
          'from._id': 1, 'from.username': 1, 'from.avatar': 1, 'from.type': 1,
          to : {
            $filter : {
              input : '$to',
              as: 'to',
              cond: {
                $eq : [ '$$to.user', new Types.ObjectId(auth._id) ]
              },
              limit: 1
            }
          }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])
    page.total = await DB.NotifyUser.count(filter)

    // Update Watch
    const listWatched : Array<Types.ObjectId> = []
    notifies.forEach(async (notify) => {
      if(!!notify.to[0] && notify.to[0].watched == 0){
        listWatched.push(notify._id)
      }
    })
    await DB.NotifyUser.updateMany(
      { _id: { $in: listWatched } }, 
      { $set: { 'to.$[match].watched': 1 } },
      { arrayFilters: [{ 'match.user': auth._id }] }
    )
    
    // Result
    return resp(event, { result: {
      list: notifies,
      page: page
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})