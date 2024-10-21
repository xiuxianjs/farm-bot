import { DB, GameApi, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return
    const txt = useParse(e.Megs, 'Text')

    const dataid = Number(txt.replace(/(#|\/)?浇水/, ''))
    const formdata: DB.UserFarmlandType = (await DB.user_farmland.findOne({
      where: { uid: UID, id: dataid },
      include: [
        { model: DB.goods, as: 'goods_gid' },
        { model: DB.goods, as: 'goods_tid' }
      ],
      raw: true
    })) as any

    const Send = useSend(e)

    if (formdata.tid == 1) {
      Send(Text('这是一块空地'))
      return
    }

    if (formdata.state == 0) {
      Send(Text('已枯萎'))

      return
    }

    const now = new Date().getTime()

    // 浇水时间 日期
    const wTime = formdata.time
    // 浇水周期延长 毫秒
    const cTimeC = formdata['goods_gid.buff']
    // 最迟浇水时间 毫秒
    const lTime = GameApi.Config.waterend + cTimeC * formdata.grade
    // 浇水周期 毫秒
    const cTime = formdata['goods_tid.cycle']
    // 下一次浇水  日期
    const nTime = wTime + cTime
    // 枯萎时间  日期
    const dTime = nTime + lTime

    // 是否枯萎
    if (now > dTime) {
      Send(Text('已枯萎'))

      // 已枯萎
      await DB.user_farmland.update(
        {
          state: 0
        },
        {
          where: {
            id: formdata.id
          }
        }
      )

      return
    }

    // 是否浇水？
    if (now < nTime) {
      Send(Text(`${GameApi.Method.convertTime(Math.floor(nTime - now))}后浇水`))

      return
    } else {
      await DB.user_farmland.update(
        { time: now },
        { where: { uid: UID, id: dataid } }
      )
      Send(Text('浇水成功'))

      return
    }
  },
  'message.create',
  /^(#|\/)?浇水\d+$/
)
