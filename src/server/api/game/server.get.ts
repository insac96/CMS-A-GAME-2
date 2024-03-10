export default defineEventHandler(async (event) => {
  try {
    const list = await gameGetServer(event)
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})