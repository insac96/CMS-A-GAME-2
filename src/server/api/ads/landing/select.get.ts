export default defineEventHandler(async (event) => {
  try {
    const categories = await DB.AdsLanding.find().select('code')
    return resp(event, { result: categories })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})