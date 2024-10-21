import { DB, GameApi, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'

export default OnResponse(
  async e => {
    const uid = e.UserId
    if (!(await isThereAUserPresent(e, uid))) return

    const txt = useParse(e.Megs, 'Text')
    const name = txt.replace(/(#|\/)?种植/, '')

    if (name == '无') return

    const farmland: DB.UserFarmlandType = await DB.user_farmland
      .findOne({
        where: { uid, tid: 1 }
      })
      .then(data => data.dataValues)

    const Send = useSend(e)

    if (!farmland) {
      Send(Text('暂无空地'))
      return
    }

    const dataId: DB.UserBagType = (await DB.user_bag.findOne({
      where: { name, uid, sell: 0 },
      include: [{ model: DB.goods }],
      raw: true
    })) as any

    if (!dataId) {
      Send(Text('没有' + name))

      return
    }

    if (dataId.typing !== 0) {
      Send(Text('不可种植' + name))

      return
    }

    // 删除种子
    await GameApi.bag.reduceBagThing(uid, [{ name, acount: 1 }], 0)

    const now = new Date().getTime()

    await DB.user_farmland.update(
      {
        // 成熟日期
        endAt: now + dataId['good.time'],
        // 种植日期
        startAt: new Date().getTime(),
        // 物品 id
        tid: dataId['good.id'],
        // 状态
        state: 1,
        // 浇水时间
        time: now
      },
      {
        where: { uid, id: farmland.id }
      }
    )
    Send(
      Text(
        ['种植' + name, `\n————————————`, '\n[@机器人 /我的农田]'].join('\n')
      )
    )
    return
  },
  'message.create',
  /^(#|\/)?种植.*$/
)
