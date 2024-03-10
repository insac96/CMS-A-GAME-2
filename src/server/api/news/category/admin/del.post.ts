import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.NewsCategory.findOne({ _id: _id }).select('name')
    if(!category) throw 'Danh mục không tồn tại'
    
    const news = await DB.News.count({ category: _id })
    if(news > 0) throw 'Không thể xóa danh mục đã có tin tức'

    await DB.NewsCategory.deleteOne({ _id: _id })
    logAdmin(event, `Xóa danh mục tin tức <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa danh mục thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})