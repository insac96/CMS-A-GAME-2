import md5 from "md5"
import type { IDBGate, IDBPayment } from "~~/types"
import type { MultiPartData } from "h3"

const parseMutipart = (data?: MultiPartData) => {
  const arr = Array.isArray(data) ? data : []
  const result = arr.reduce((prev: Record<string,any>, curr) => {
    prev[String(curr.name)] = curr.data.toString('utf8')
    return prev
  }, [])
  
  return result
}
export default defineEventHandler(async (event) => {
  try {
    const formData : any = await readMultipartFormData(event)
    const body : any = parseMutipart(formData)
    const { fullID, partnerID, partnerNum, time, sign, amount } = body
    if(!fullID || !partnerID || !partnerNum || !time || !sign || !amount) throw 'Không có quyền quy cập'

    
  } 
  catch (e:any) {
    setResponseStatus(event, 500)
    return {
      message: e.toString()
    }
  }
})