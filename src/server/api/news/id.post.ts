export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tin tức'

    const news = await DB.News
    .findOneAndUpdate({ _id: _id, display: 1 }, { $inc: { view: 1 } }, { new: true })
    .populate({ path: 'category', select: 'name color' })
    .populate({ path: 'updater', select: 'avatar username' })

    if(!news) throw 'Tin tức không tồn tại'
    return resp(event, { result: news })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})