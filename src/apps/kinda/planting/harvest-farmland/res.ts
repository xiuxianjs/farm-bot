import { DB, GameApi, isThereAUserPresent } from '@src/api'
import { Text, useSend } from 'alemonjs'

export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const uData: DB.UserHomeType = await DB.user_home
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(data => data.dataValues)

    // 我的农场
    const farmNum: DB.UserFarmlandType[] = (await DB.user_farmland.findAll({
      where: { uid: UID },
      raw: true,
      include: [
        { model: DB.goods, as: 'goods_gid' },
        { model: DB.goods, as: 'goods_tid' }
      ]
    })) as any

    // 记录
    const log = []

    // 用户经验所得统计
    let exp = 0

    for (const item of farmNum) {
      let title = `🔷${item.id}(LV:${item.grade},EXP:${item.exp})`
      if (item.tid == 1) continue
      if (item.state == 0) {
        log.push(`${title}[${item['goods_tid.name']}]\n(已枯萎)`)
        continue
      }

      const now = new Date().getTime()

      // 浇水时间 日期
      const wTime = item.time
      // 浇水周期延长 毫秒
      const cTimeC = item['goods_gid.buff']
      // 最迟浇水时间 毫秒
      const lTime = GameApi.Config.waterend + cTimeC * item.grade
      // 浇水周期 毫秒
      const cTime = item['goods_tid.cycle']
      // 下一次浇水时间  日期
      const nTime = wTime + cTime
      // 枯萎时间  日期
      const dTime = nTime + lTime
      // 种植时间 日期
      const sTime = item.startAt
      // 成熟时间 日期
      const eTime = sTime + item['goods_tid.time']

      if (now > dTime) {
        log.push(`${title}[${item['goods_tid.name']}]\n(已枯萎)`)
        // 已枯萎
        await DB.user_farmland.update(
          {
            state: 0
          },
          {
            where: {
              id: item.id
            }
          }
        )
        continue
      }

      if (now > eTime) {
        if (!(await GameApi.bag.backpackFull(UID, uData.grade))) {
          log.push(`${title}[${item['goods_tid.name']}]\n(仓库容量不足)`)
          continue
        }
        const farmlandExp = GameApi.Config.farmlandExp
        // 基础经验 + 作物经验
        const userExp =
          (GameApi.Config.userExp + item['goods_tid.buff']) * item.grade
        exp += userExp

        log.push(
          `${title}[${item['goods_tid.name']}]\n(成功收割)\n(农田exp+${farmlandExp},个人exp+${userExp})`
        )
        // 成功收割就初始化该农田
        await DB.user_farmland.update(
          {
            // 成熟时间
            endAt: 0,
            // 种植
            startAt: 0,
            // 物品 id
            tid: 1,
            // 状态
            state: 1,
            // 浇水时间
            time: 0,
            exp: item.exp + farmlandExp
          },
          {
            where: {
              id: item.id
            }
          }
        )

        // 用户背包增加成熟物
        await GameApi.bag.addBagThing(
          UID,
          uData.grade,
          [
            {
              name: item['goods_tid.name'],
              acount: 1,
              typing: item['goods_tid.typing']
            }
          ],
          // 成熟物
          1
        )
        continue
      }
    }

    if (exp > 0) {
      // 增加用户经验
      const uData: DB.UserType = await DB.user
        .findOne({
          where: {
            uid: UID
          }
        })
        .then(data => data.dataValues)
      await DB.user.update(
        {
          exp: uData.exp + exp
        },
        {
          where: {
            uid: UID
          }
        }
      )
    }

    const Send = useSend(e)
    if (log.length == 0) {
      Send(Text('所有作物都没有成熟'))
    } else {
      Send(Text(log.join('\n')))
    }

    return
  },
  'message.create',
  /^(#|\/)?收割((农田|家园|农场)?)$/
)
