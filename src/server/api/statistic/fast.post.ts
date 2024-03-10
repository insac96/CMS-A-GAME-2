import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { type, secret } = await readBody(event)
    if(!type) throw 'Dữ liệu đầu vào không đủ'

    if(!secret){
      const auth = await getAuth(event) as IAuth
      if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
    }

    let start : any, end : any, format : any
    const now = DayJS(Date.now())
    if(type == 'day'){
      start = now.startOf('date')
      end = now.endOf('date')
      format = '%Y-%m-%d'
    }
    if(type == 'month'){
      start = now.startOf('month')
      end = now.endOf('month')
      format = '%Y-%m'
    }

    let payment : any, signin : any, signup : any
    if(type == 'day' || type == 'month'){
      const match : any = {}
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }

      payment = await DB.Payment.aggregate([
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            },
            money: {
              total: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            money: { $sum: '$money.total' },
          }
        },
        { $match: match }
      ])
  
      signin = await DB.UserLogin.aggregate([
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            count: { $count: {} },
          }
        },
        { $match: match },
      ])
  
      signup = await DB.User.aggregate([
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            count: { $count: {} },
          }
        },
        { $match: match }
      ])
    }

    if(type == 'total') {
      payment = await DB.Payment.aggregate([
        { $match: { 'status': 1 }},
        {
          $group: {
            _id: null,
            money: { $sum: '$money' },
          }
        }
      ])

      const users = await DB.User.count()
      signin = [{ count: users }]
      signup = [{ count: users }]
    }

    return resp(event, {
      result: {
        payment: payment[0] ? payment[0]['money'] : 0,
        signin: signin[0] ? signin[0]['count'] : 0,
        signup: signup[0] ? signup[0]['count'] : 0,
      }
    })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})