import { DB, GameApi, isThereAUserPresent, Formats } from '@src/api'
import { Text, useSend } from 'alemonjs'

export default OnResponse(
  async e => {
    const uid = e.UserId
    if (!(await isThereAUserPresent(e, uid))) return

    const userSignData = await DB.user_sign
      .findOne({
        where: { uid }
      })
      .then(data => data.dataValues)

    const Send = useSend(e)

    // 是否同一天
    if (Formats.isSameDay(new Date(), userSignData.updateAt)) {
      Send(Text('今天已经签到了，无法重复签到呀'))

      return
    }
    // 正常签到
    else {
      // 是否连续
      const isContinuous =
        new Date().getDate() - new Date(userSignData.updateAt).getDate() == 1
      // 是否次月
      const isNewMonth = new Date().getDate() == 1

      await DB.user_sign.update(
        {
          continuous: isContinuous ? userSignData.continuous + 1 : 1,
          day: userSignData.day + 1,
          math: isNewMonth ? 1 : userSignData.math + 1,
          updateAt: Formats.date(new Date(), 'YYYY-MM-DD hh:mm')
        },
        { where: { uid } }
      )
    }

    const userData = await DB.user
      .findOne({
        attributes: ['species'],
        where: { uid }
      })
      .then(data => data.dataValues)

    await DB.user.update(
      {
        exp: (userData.exp || 0) + GameApi.Config.empirical,
        species: (userData.species || 0) + GameApi.Config.coin
      },
      { where: { uid } }
    )

    Send(
      Text(
        [
          `签到成功\n恭喜你获取了\n[金币]*${GameApi.Config.coin}`,
          `————————————`,
          `[@机器人 /商店]`,
          `[@机器人 /购买+物品名]`
        ].join('\n')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?(每日)?签到$/
)
