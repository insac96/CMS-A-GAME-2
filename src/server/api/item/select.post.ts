export default defineEventHandler(async (event) => {
  try {
    const { types } = await readBody(event)
    
    const match : any = {}
    if(!!types && types.length) match['type'] = { $in: types }

    const items = await DB.Item.find(match).select('item_id item_name item_image type')
    return resp(event, { result: items })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})