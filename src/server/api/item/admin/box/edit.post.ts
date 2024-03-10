import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, name, gift } = body
    if(!_id || !name || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const itembox = await DB.ItemBox.findOne({ _id: _id }).select('name')
    if(!itembox) throw 'Gói không tồn tại'

    if(itembox.name != name){
      const getByName = await DB.ItemBox.findOne({ name: name }).select('_id')
      if(!!getByName) throw 'Tên gói đã tồn tại'
    }

    delete body['_id']
    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    body.gift = giftFormat
    await DB.ItemBox.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa gói vật phẩm <b>${itembox.name}</b>`)
    return resp(event, { message: 'Sửa gói thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})