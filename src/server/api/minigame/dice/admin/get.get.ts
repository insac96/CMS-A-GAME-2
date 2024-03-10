import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    const config = await DB.Dice.findOne().select('-createdAt -updatedAt')
    if(!config) throw 'Không tìm thấy cấu hình xúc xắc'
    
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})