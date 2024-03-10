export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã Landing'

    const landing = await DB.AdsLanding
    .findOneAndUpdate({ code: code }, { $inc: { view: 1 } }, { new: true })
    .select('code link')

    if(!landing) throw 'Landing không tồn tại'
    return resp(event, { result: landing })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})