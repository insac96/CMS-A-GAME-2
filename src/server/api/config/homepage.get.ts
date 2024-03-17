import { IDBAdsLanding, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config.findOne().select('enable homepage') as IDBConfig

    if(!!config.enable.landing && !!config.homepage.landing){
      const landing = await DB.AdsLanding.findOne({ _id: config.homepage.landing }) as IDBAdsLanding
      if(!!landing) return resp(event, { result: landing.link })
    }

    return resp(event, { result: '/' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})