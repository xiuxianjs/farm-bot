import { DB, isThereAUserPresent } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return
    const Userdata: DB.UserHomeType = (await DB.user_home.findOne({
      where: {
        uid: UID
      },
      include: [{ model: DB.user }],
      raw: true
    })) as any

    const Send = useSend(e)

    Send(
      Text(
        [
          `昵称:${Userdata['user.name']}`,
          `签名:${Userdata['user.autograph']}`,
          `等级:${Userdata['user.grade']}`,
          `金币:${Userdata['user.species']}`,
          `仓库等级:${Userdata.grade}`,
          `累计经验:${Userdata.exp}`
        ].join('\n')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?我的信息$/
)
