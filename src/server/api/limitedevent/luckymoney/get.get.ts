import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    let user
    const auth = await getAuth(event, false) as IAuth | null
    if(!!auth){
      user = await DB.User.findOne({ _id: auth._id }).select('limitedevent.luckymoney')
    }

    return resp(event, { result: {user} })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})