import type { IAuth, IDBGameRankGift, IDBItem } from "~~/types"

const typeList = ['level', 'power']

const getReceice = async (event : any, rankgift : IDBGameRankGift) : Promise<boolean> => {
  const auth = await getAuth(event, false) as IAuth | null
  if(!auth) return false

  // Kiểm tra thời gian được nhận
  const now = formatDate(event, new Date())
  const expired = formatDate(event, rankgift.expired)
  if(now.timestamp < expired.timestamp) return false

  // Kiểm tra lịch sử nhận
  const countUserReceive = await DB.GameRankGiftHistory.count({ rankgift: rankgift._id, user: auth._id })
  if(countUserReceive > 0) return false

  const maxCountReceive = rankgift.end - rankgift.start + 1
  const countReceive = await DB.GameRankGiftHistory.count({ rankgift: rankgift._id })
  if(countReceive >= maxCountReceive) return false

  // Lấy danh sách nhân vật của tài khoản
  const roleList = await gameGetRole(event, {
    server_id: rankgift.server,
    account: auth.username
  }, true)
  if(!roleList || roleList.length == 0) return false

  // Lấy danh sách xếp hạng
  const rankList = rankgift.type == 'level' ? await gameGetRankLevel(event, {
    server_id: rankgift.server
  }, true) : await gameGetRankPower(event, {
    server_id: rankgift.server
  }, true)
  if(!rankList || rankList.length == 0) return false

  // Kiểm tra nhân vật có trong bảng xếp hạng hay không
  const roleActive : any = []
  roleList.forEach((role : any) => {
    const find = rankList.find((i : any) => i.role_id == role.role_id)
    if(!!find) roleActive.push(find)
  })
  if(roleActive.length < 1) return false

  // Kiểm tra nhân vật có thứ hạng đúng không
  let roleRankActive = 0
  roleActive.forEach((role : any) => {
    if(role.rank >= rankgift.start && role.rank <= rankgift.end) roleRankActive++
  })
  if(roleRankActive == 0) return false
  return true
}

export default defineEventHandler(async (event) => {
  try {
    const { rank, type, server } = await readBody(event)
    if(!rank || !type || !server) throw 'Dữ liệu đầu vào sai'
    if(!typeList.includes(type)) throw 'Kiểu xếp hạng không hỗ trợ'
    if(rank < 0 || rank > 10) throw 'Thứ hạng không hỗ trợ'

    const rankgift = await DB.GameRankGift
    .findOne({
      type: type,
      server: server,
      start: { $lte: rank },
      end: { $gte: rank }
    })
    .populate({
      path: 'gift.item',
      select: 'item_name item_image type'
    }) as IDBGameRankGift

    if(!rankgift) throw 'Chưa có phần thưởng cho thứ hạng này'
    if(rankgift.gift.length < 1) throw 'Chúng tôi đang cập nhật phần thưởng, vui lòng quay lại sau'

    const result : any = JSON.parse(JSON.stringify(rankgift))
    result.gift = rankgift.gift.map(gift => ({
      name: (gift.item as IDBItem).item_name,
      image: (gift.item as IDBItem).item_image,
      type: (gift.item as IDBItem).type,
      amount: gift.amount
    }))

    const receice = await getReceice(event, rankgift)
    result.receice = receice

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})