import { DB } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData: DB.UserType = await DB.user
      .findOne({
        attributes: ['uid'],
        where: {
          uid: UID
        }
      })
      .then(data => data.dataValues)

    const Send = useSend(e)

    if (UserData) {
      Send(
        Text([`已建立家园`, `————————————`, '[@机器人 /我的信息]'].join('\n'))
      )
      return
    }

    return
  },
  'message.create',
  /^(#|\/)?(建立|创建|建设)(家园|农场|农田)/
)
