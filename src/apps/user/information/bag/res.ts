import { DB, GameApi, isThereAUserPresent } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const uid = e.UserId
    if (!(await isThereAUserPresent(e, uid))) return

    const bagData: DB.UserBagType[] = (await DB.user_bag.findAll({
      where: { uid },
      include: [
        {
          model: DB.goods
        }
      ],
      raw: true
    })) as any

    const Send = useSend(e)

    if (bagData?.length == 0) {
      Send(Text('仓库空空荡荡...'))

      return
    }

    // 种子
    const bagData1 = bagData.filter(item => {
      if (item.sell == 0) return true
      return false
    })

    // 物品
    const bagData2 = bagData.filter(item => {
      if (item.sell == 0) return false
      return true
    })

    const msg1: string[] = []
    //
    for (const item of bagData1) {
      msg1.push(
        `🔶种子[${item.name}]￥${item['good.price']}\n(成熟:${Math.floor(
          item['good.time'] / 1000 / 60
        )}分|周期:${Math.floor(item['good.cycle'] / 1000 / 60)}分|经验:${
          item['good.buff']
        })\n(数量:${item.acount})`
      )
    }
    //
    const msg2 = GameApi.good.getListMsgByUser(bagData2)
    const msg = [...msg1, ...msg2]
    Send(Text(msg.join('\n')))
    return
  },
  'message.create',
  /^(#|\/)?(我的?)(背包|仓库)/
)
