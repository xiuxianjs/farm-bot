import { DB, isThereAUserPresent } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const uid = e.UserId
    if (!(await isThereAUserPresent(e, uid))) return

    const userDataList = await DB.user_sign.findAll({
      order: [['continuous', 'DESC']],
      limit: 15,
      raw: true,
      include: [{ model: DB.user, attributes: ['name', 'species'] }]
    })

    const list = userDataList.filter(v => v['continuous'])

    const Send = useSend(e)

    if (!list.length) {
      Send(Text('还没有人签到'))
      return
    }

    const data = list.map((v, i) => {
      return `第${i + 1}名：用户名字：${v['user.name']}， 签到天数：${
        v['continuous']
      }`
    })

    Send(Text(data.join('\n')))

    return
  },
  'message.create',
  /^(#|\/)?(连续)?签到排(名|行榜)$/
)
