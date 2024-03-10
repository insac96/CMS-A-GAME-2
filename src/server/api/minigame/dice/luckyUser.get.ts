export default defineEventHandler(async (event) => {
  try {
    const list = await DB.DiceLuckyUser
    .find({})
    .select('user action createdAt')
    .populate({ path: 'user', select: 'username avatar' })
    .sort({ createdAt: -1 })
    .limit(5)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})