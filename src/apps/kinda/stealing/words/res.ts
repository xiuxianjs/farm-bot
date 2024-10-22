import { DB, isThereAUserPresent, GameApi, victoryCooling } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'

export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    // 如果身上没钱  直接被对方赶出门
    const AData = await DB.user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(data => data.dataValues)

    const Send = useSend(e)

    if (AData.species < GameApi.Config.deduct) {
      Send(Text('想突然想去对方家做客,身上没钱的你被对方赶了出来'))

      return
    }

    const txt = useParse(e.Megs, 'Text')

    const ID = Number(txt.replace(/(#|\/)?偷菜/, ''))

    const BData = await DB.user
      .findOne({
        where: {
          id: ID
        }
      })
      .then(data => data.dataValues)

    if (!BData) return

    const data: string[] = JSON.parse((await GameApi.Redis.get(UID)) ?? '[]')

    if (!data.find(item => item == BData.uid)) {
      Send(Text('列表中不存在该农场,请翻阅[/农场列表]刷新'))

      return
    }

    const CDID = 0
    if (!(await victoryCooling(e, UID, CDID))) return

    // 设置冷却
    GameApi.Burial.set(UID, CDID)

    const gData = await DB.user_dog
      .findOne({
        where: {
          uid: BData.uid,
          state: 1 // 被放置的
        }
      })
      .then(data => data.dataValues)

    if (gData) {
      // 狗狗不能饥饿的
      const p = gData.grade * GameApi.Config.prevent
      if (gData.endAt != 0 && GameApi.Method.isTrueInRange(0, 100, p)) {
        Send(Text('被对方狗狗发现了,赔了' + GameApi.Config.deduct + '金币'))

        DB.user.update(
          {
            species: AData.species - GameApi.Config.deduct
          },
          {
            where: {
              uid: AData.uid
            }
          }
        )
        return
      }
    }

    // 他的农场
    const farmNum: any[] = await DB.user_farmland.findAll({
      where: { uid: BData.uid },
      raw: true,
      include: [
        { model: DB.goods, as: 'goods_gid' },
        { model: DB.goods, as: 'goods_tid' }
      ]
    })

    // 记录
    const log = []

    // 用户经验所得统计
    let exp = 0

    for (const item of farmNum) {
      let title = `🔷${item.id}(LV:${item.grade},EXP:${item.exp})`
      if (item.tid == 1) continue
      if (item.state == 0) continue

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

      if (now > dTime) continue

      if (now > eTime) {
        if (!(await GameApi.bag.backpackFull(UID, AData.grade))) {
          log.push(`${title}[${item['goods_tid.name']}]\n(仓库容量不足)`)
          continue
        }
        const farmlandExp = GameApi.Config.farmlandExp
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
            // 种植时间
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
          AData.grade,
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
      }
      continue
    }

    if (exp > 0) {
      // 增加用户经验
      await DB.user.update(
        {
          exp: AData.exp + exp
        },
        {
          where: {
            uid: UID
          }
        }
      )
    }

    if (log.length == 0) {
      Send(Text('对方所有作物都没有成熟'))
    } else {
      Send(Text(log.join('\n')))
    }

    return
  },
  'message.create',
  /^(#|\/)?偷菜\d+$/
)
