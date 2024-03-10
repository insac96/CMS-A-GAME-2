export default defineEventHandler(async (event) => {
  try {
    const { server } = await readBody(event)
    if(!server) throw 'Dữ liệu đầu vào sai'

    const list = await gameGetRankLevel(event, {
      server_id: server
    })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})