import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, category, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const filter:any = { display: 1 }
    if(!!category){
      filter['category'] = new Types.ObjectId(category)
    }
    if(!!search){
      filter['title'] = { $regex : search, $options : 'i' }
    }

    const list = await DB.News
    .find(filter)
    .select('category title description og_image pin updatedAt')
    .populate({ path: 'category', select: 'name color' })
    .sort({ pin: -1, updatedAt: -1 })
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.News.count(filter)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})