export default defineEventHandler(async (event) => {
  try {
    const config = await DB.PaymentConfig.findOne().select('maintenance pay')

    if(!config) throw 'Không tìm thấy cấu hình'
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})