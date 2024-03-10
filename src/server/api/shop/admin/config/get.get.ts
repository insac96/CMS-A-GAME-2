export default defineEventHandler(async (event) => {
  try {
    const config = await DB.ShopConfig.findOne()

    if(!config) throw 'Không tìm thấy cấu hình cửa hàng'
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})