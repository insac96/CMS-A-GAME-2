export default defineEventHandler(async (event) => {
  try {
    const count = await DB.SocketChat.count()
    if(count < 1) await createChat(event, 'bot', 'Để lại lời nhắn, cùng nhau trò chuyện với mọi người nhé...')

    const list = await DB.SocketChat
    .find({})
    .select('-updatedAt')
    .populate({ path: 'user', select: 'username level avatar type', populate: {
      path: 'level', select: 'number'
    } })
    .sort({ createdAt: -1 })
    .limit(10)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})