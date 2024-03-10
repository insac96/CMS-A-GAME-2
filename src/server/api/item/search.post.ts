export default defineEventHandler(async (event) => {
  try {
    const { types, key } = await readBody(event)
    
    const match : any = {
      $or: [
        { item_name: { $regex : key, $options : 'i' }},
        { item_id: { $regex : key, $options : 'i' }},
      ]
      
    }
    if(!!types && types.length) match['type'] = { $in: types }

    const items = await DB.Item
    .find(match)
    .select('item_id item_name item_image type')
    .limit(10)

    return resp(event, { result: items })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})