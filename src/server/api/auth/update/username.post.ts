import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { username } = await readBody(event)
    if (!username) throw 'Vui lòng nhập tên định danh'
    if (username.length < 6 || username.length > 15) throw 'Tên định danh trong khoảng 6-15 ký tự'
    if (!!username.match(/\s/g)) throw 'Tên định danh không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tên định danh không có ký tự đặc biệt và viết hoa'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tên định danh không hợp lệ'

    const user = await DB.User.findOne({ _id: auth._id }).select('username block')
    if(!user) throw 'Tài khoản không tồn tại'
    if(user.block == 1) throw 'Tài khoản đang bị khóa, không thể đặt tên định danh'
    if(!!user.username) throw 'Tài khoản đã có tên định danh'

    const userCheck = await DB.User.findOne({ username: username }).select('_id')
    if(!!userCheck) throw 'Tên định danh đã tồn tại'

    user.username = username
    await user.save()

    await sendNotifyUser(event, {
      to: [ user._id ],
      type: 3,
      color: 'blue',
      content: `Bạn đã thao tác đặt <b>tên định danh</b> tài khoản`
    })

    return resp(event, { message: 'Đặt tên định danh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})