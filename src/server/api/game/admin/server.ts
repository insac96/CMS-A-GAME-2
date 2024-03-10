import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, range, server_id } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!server_id) throw 'Vui lòng chọn máy chủ'
    
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = DayJS(range['start']).startOf('date')
      const end : any = DayJS(range['end']).endOf('date')
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    }

    console.log(match)

    const shop = await DB.ShopHistory.aggregate([
      { $match: { server: server_id }},
      {
        $project: {
          createdAt: 1,
          price: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
          }
        }
      },
      {
        $group: {
          _id: '$timeformat',
          time: { $min: '$createdAt' },
          spend: { $sum: '$price' },
        }
      },
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: shop[0].list ? shop[0].list : [],
      total: shop[0].pagination ? (shop[0].pagination[0] ? shop[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})