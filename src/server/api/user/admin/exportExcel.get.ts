import type { IAuth } from "~~/types"
import excelJS from 'exceljs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet('Users')

    worksheet.columns = [ 
      { header: "Username", key: "username", width: 15 }, 
      { header: "Phone", key: "phone", width: 15 }, 
      { header: "Email", key: "email", width: 25 },
      { header: "Payment", key: "payment", width: 15 },
    ]

    const users = await DB.User.aggregate([
      { $match : {
        $and: [
          { phone: { $exists: true }},
          { email: { $exists: true }},
        ]
      }},
      { $project: {
        username: 1, phone: 1, email: 1,
        payment: '$pay.total.money'
      }},
      { $sort: { payment: -1 }}
    ])

    users.forEach(user => { worksheet.addRow(user) })

    const createdAt = formatDate(event, new Date())
    const filename = `excel-users-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.xlsx`
    const filePath = join('dist/excel', filename)
    await workbook.xlsx.writeFile(filePath) as any

    return resp(event, { result: `/excel/${filename}` })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})