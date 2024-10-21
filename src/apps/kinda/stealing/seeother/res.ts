import {
  DB,
  isThereAUserPresent,
  GameApi,
  victoryCooling,
  sendReply
} from '@src/api'

export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const CDID = 1
    if (!(await victoryCooling(e, UID, CDID))) return

    // 随机 20 个玩家
    const uData: DB.UserType[] = (await DB.user.findAll({
      where: {
        uid: {
          // 不能是自己的
          [DB.Op.ne]: UID
        }
      },
      order: DB.literal('RAND()'),
      // 20 个随机玩家
      limit: 20,
      raw: true
    })) as any

    // 压缩uid
    const data: string[] = uData.map(item => item.uid)

    const fData: DB.UserFarmlandType[] = (await DB.user_farmland.findAll({
      where: {
        uid: data,
        state: 1 // 所有状态为
      },
      raw: true
    })) as any

    // 压缩uid
    const uidList = [...new Set(fData.map(item => item.uid))]

    // 随机得到 10个玩家 并把 十个玩家 存到 redis
    GameApi.Redis.set(UID, JSON.stringify(uidList))

    // 最多8个
    const msg: string[] = []

    let x = 0

    for (const item of uData) {
      // 不在里面
      if (!uidList.find(jtem => jtem == item.uid)) {
        continue
      }
      msg.push(`🔷${item.id}(LV:${item.grade},EXP:${item.exp})${item.name}`)
      x++
      if (x >= 8) break
    }

    sendReply(e, '[农场列表]', msg)

    // 设置冷却
    GameApi.Burial.set(UID, CDID)
    return
  },
  'message.create',
  /^(#|\/)?(农场|农田|家园)列表$/
)
