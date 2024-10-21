import { DB, GameApi, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'

export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const txt = useParse(e.Megs, 'Text')

    const [name, acount] = txt.replace(/(#|\/)?出售/, '').split('*')

    const thing_shu: number = Number(acount) || 1 //数量

    const uData: DB.UserType = await DB.user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(data => data.dataValues)

    const Send = useSend(e)

    if (uData.coins >= uData.coins_limit) {
      Send(Text('商店单日金币获取数已达上限'))

      return
    }

    const bagdata: DB.UserBagType = (await DB.user_bag.findOne({
      where: { uid: UID, name: name, sell: 1 },
      include: [{ model: DB.goods }],
      raw: true
    })) as any

    if (bagdata.acount < thing_shu) {
      Send(Text(`${name}数量不足`))

      return
    }

    // 价格计算
    const money = bagdata['good.selling_price'] * thing_shu

    // 计算
    if (uData.coins + money >= uData.coins_limit) {
      Send(Text('当前出售所得金币大于单日金币剩余获取数'))

      return
    }

    // 删除物品
    await GameApi.bag.reduceBagThing(UID, [{ name: name, acount: thing_shu }])

    await DB.user.update(
      { species: uData.species + money },
      { where: { uid: UID } }
    )

    Send(
      Text(
        [
          `出售成功获得${money}`,
          `\n————————————`,
          '\n[@机器人 /我的信息]'
        ].join('\n')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?出售(.*)$/
)
