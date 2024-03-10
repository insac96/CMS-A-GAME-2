import type { IDBAdsTeaser, IDBItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã Teaser'

    const teaser = await DB.AdsTeaser
    .findOneAndUpdate({ code: code }, { $inc: { view: 1 } }, { new: true })
    .populate({
      path: 'gift.item',
      select: 'item_id item_name item_image type'
    }) as IDBAdsTeaser

    if(!teaser) throw 'Teaser không tồn tại'

    const result : any = {}
    result._id = teaser._id
    result.gift = teaser.gift.map((i : any) => ({
      name: (i.item as IDBItem).item_name,
      image: (i.item as IDBItem).item_image,
      type: (i.item as IDBItem).type,
      amount: i.amount
    }))
    result.signup = teaser.sign.up
    result.link = teaser.link
    result.code = teaser.code

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})