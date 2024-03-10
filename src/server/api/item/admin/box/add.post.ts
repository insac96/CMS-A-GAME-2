import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { name, gift } = body
    if(!name || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const getByName = await DB.ItemBox.findOne({ name: name }).select('_id')
    if(!!getByName) throw 'Tên gói đã tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    body.gift = giftFormat

    await DB.ItemBox.create(body)

    logAdmin(event, `Thêm gói vật phẩm <b>${name}</b>`)
    return resp(event, { message: 'Thêm mã thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})