export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config.findOne().select('privacy') 
    if(!config) throw 'Không tìm thấy cấu hình trang'

    return resp(event, { result: config.privacy })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})