export default defineEventHandler(async (event) => {
  try {
    const { type } = await readBody(event)
    if(!type) throw 'Dữ liệu đầu vào sai'

    const match : any = {}
    if(type == 'member'){
      match['user.type'] = 0
    }
    else if(type == 'admin'){
      match['user.type'] = { $gt: 0 }
    }
    else {
      throw 'Kiểu dữ liệu không hỗ trợ'
    }

    const online = await DB.SocketOnline
    .aggregate([
      { $match: {
        user: { $exists: true }
      }},
      { $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        pipeline: [
          { $project: { username: 1, avatar: 1, type: 1, level: 1} },
        ],
        as: "user"
      }},
      { $unwind: { path: '$user' }},
      { $lookup: {
        from: "levels",
        localField: "user.level",
        foreignField: "_id",
        pipeline: [
          { $project: { number: 1 } },
        ],
        as: "level"
      }},
      { $unwind: { path: '$level', preserveNullAndEmptyArrays: true }},
      { $match: match},
      { $project: {
        _id: '$user._id',
        username: '$user.username',
        avatar: '$user.avatar',
        type: '$user.type',
        level: '$level'
      }}
    ])

    return resp(event, { result: online })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})