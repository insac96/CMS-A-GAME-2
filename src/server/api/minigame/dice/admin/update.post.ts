import type { IAuth, IDBDice } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { jar, percent } = await readBody(event)
    if(!jar || !percent) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(jar.default)) || parseInt(jar.default) < 0
      || !!isNaN(parseInt(jar.now)) || parseInt(jar.now) < 0
      || !!isNaN(parseInt(percent.win)) || parseInt(percent.win) < 0
      || !!isNaN(parseInt(percent.six)) || parseInt(percent.six) < 0
      || !!isNaN(parseInt(percent.other)) || parseInt(percent.other) < 0
    ) throw 'Dữ liệu đầu vào sai'
    
    const diceConfig = await DB.Dice.findOne({}) as IDBDice

    const change : any = []
    if(diceConfig.jar.default != jar.default) change.push('hũ mặc định')
    if(diceConfig.jar.now != jar.now) change.push('hũ hiện tại')
    if(diceConfig.percent.win != percent.win) change.push('tỷ lệ thắng')
    if(diceConfig.percent.six != percent.six) change.push('tỷ lệ nổ hũ 666')
    if(diceConfig.percent.other != percent.other) change.push('tỷ lệ nổ hũ nhỏ')
    
    if(change.length > 0){
      await DB.Dice.updateMany({}, { jar, percent })
      logAdmin(event, `Sửa thông tin <b>${change.join(', ')}</b> của xúc xắc`)
    }

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})