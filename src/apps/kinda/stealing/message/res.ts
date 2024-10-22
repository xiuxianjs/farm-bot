import { DB, isThereAUserPresent, GameApi, victoryCooling } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'

export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const CDID = 4
    if (!(await victoryCooling(e, UID, CDID))) return

    const txt = useParse(e.Megs, 'Text')

    const ID = Number(txt.replace(/(#|\/)?(农田|农场)信息/, ''))

    const uData = await DB.user
      .findOne({
        where: {
          id: ID
        }
      })
      .then(data => data.dataValues)

    if (!uData) return

    const Send = useSend(e)

    const data: string[] = JSON.parse((await GameApi.Redis.get(UID)) ?? '[]')

    if (!data.find(item => item == uData.uid)) {
      Send(Text('列表中不存在该农场,请翻阅[/农场列表]刷新'))
      return
    }

    // 我的农场
    const farmNum: any[] = await DB.user_farmland.findAll({
      where: { uid: uData.uid },
      raw: true,
      include: [
        { model: DB.goods, as: 'goods_gid' },
        { model: DB.goods, as: 'goods_tid' }
      ]
    })

    // 记录
    const log = ['偷菜标记:' + ID]

    for (const item of farmNum) {
      let title = `🔷${item.id}(LV:${item.grade},EXP:${item.exp})`

      if (item.tid == 1) {
        // 空地
        log.push(`${title}[空地]`)
        continue
      }

      title += `[${item['goods_tid.name']}]`

      if (item.state == 0) {
        // 死掉了
        log.push(`${title}\n(已枯萎)`)
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
        // 已枯萎
        log.push(`${title}\n(已枯萎)`)
        continue
      }

      if (now > eTime) {
        // 成熟了
        title += `\n(已成熟)`
      } else {
        title += `\n(${GameApi.Method.convertTime(
          Math.floor(eTime - now)
        )}后成熟)`
      }

      // 是否浇水？
      if (now < nTime) {
        //  不需要浇水  xxx之后浇水
        title += `\n(${GameApi.Method.convertTime(
          Math.floor(nTime - now)
        )}后浇水)`
      } else {
        // 需要浇水  xxx之内浇水 枯萎 -现在的时间
        title += `\n(${GameApi.Method.convertTime(
          Math.floor(dTime - now)
        )}内浇水)`
      }

      log.push(title)

      continue
    }

    GameApi.Burial.set(UID, CDID)

    Send(Text(log.join('\n')))

    return
  },
  'message.create',
  /^(#|\/)?(农田|农场|家园)信息\d+$/
)
