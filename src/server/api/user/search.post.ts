export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)

    const users = await DB.User.find({
      username : { $regex : key.toLowerCase(), $options : 'i' }
    }).select('username').limit(5)

    return resp(event, { result: users })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})