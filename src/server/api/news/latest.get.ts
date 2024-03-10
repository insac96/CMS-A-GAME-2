export default defineEventHandler(async (event) => {
  try {
    const news = await DB.News
    .find({ display: 1 })
    .select('category title description og_image pin updatedAt')
    .populate({ path: 'category', select: 'name color' })
    .sort({ pin: -1, updatedAt: -1 })
    .limit(6)

    return resp(event, { result: news })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})