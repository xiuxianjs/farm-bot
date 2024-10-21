import { DB, isThereAUserPresent } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const uid = e.UserId
    if (!(await isThereAUserPresent(e, uid))) return
    const uData: DB.UserSignType = (await DB.user_sign.findOne({
      where: { uid },
      include: [{ model: DB.user }],
      raw: true
    })) as any

    const Send = useSend(e)

    Send(
      Text(
        [
          `昵称:${uData['user.name']}`,
          `等级:${uData['user.grade']}`,
          `金币:${uData['user.species']}`,
          `累计签到:${uData.day}天`,
          `连续签到:${uData.continuous}天`
        ].join('\n')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?我的签到$/
)
