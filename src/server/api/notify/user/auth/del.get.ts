import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    await DB.NotifyUser.updateMany({
      $and: [
        { to: { $elemMatch: { user: auth._id }}  },
        {'to.1': { $exists: true }}
      ]
    }, {
      $pull: {
        to: { user: auth._id }
      }
    })

    await DB.NotifyUser.deleteMany({
      $and: [
        { to: { $elemMatch: { user: auth._id }}  },
        { to: { $size: 1 }}
      ]
    })

    return resp(event, { message: 'Xóa tin nhắn cá nhân thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})