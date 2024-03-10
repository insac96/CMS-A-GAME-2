import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { number, auth } = await readBody(event)
    if(!number && !auth) throw 'Dữ liệu đầu vào không đủ'

    let levelData, authData

    if(!!auth){
      const authContext = await getAuth(event) as IAuth
      authData = await DB.User.findOne({ _id: authContext._id }).select('pay spend dice wheel level')
      levelData = await DB.Level.findOne({ _id: authData.level }).select('number limit')
      delete authData['level']
    }
    else {
      if(!number) throw 'Cấp độ đầu vào sai'
      levelData = await DB.Level.findOne({ number: number }).select('number limit')
    }

    if(!levelData) throw 'Không tìm thấy dữ liệu cấp độ'
    return resp(event, { result: { level: levelData, auth: authData } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})