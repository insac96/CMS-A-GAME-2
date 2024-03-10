export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Dice.findOne().select('jar')
    if(!config) throw 'Không tìm thấy cấu hình xúc xắc'

    await DB.Dice.updateMany({
      'jar.now' : { $lt: config.jar['default'] }
    }, {
      'jar.now' : config.jar['default']
    })

    const dice = await DB.Dice.findOne().select('jar.now')
    return resp(event, { result: dice })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})