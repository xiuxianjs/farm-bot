import { DB, isThereAUserPresent, GameApi, Formats } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const Send = useSend(e)

    let dogs: DB.UserDogType[] = (await DB.user_dog.findAll({
      where: { uid: UID },
      raw: true,
      include: [
        {
          model: DB.levels,
          where: {
            typing: 3
          }
        },
        { model: DB.goods },
        { model: DB.user }
      ]
    })) as any
    dogs = dogs.filter(el => {
      const { hours } = Formats.formatBbsTime(el.endAt)
      if (hours > GameApi.Config.dogDeathTime) {
        Send(Text(`你的狗狗${el['good.name']}饿死了`))

        DB.user_dog.destroy({
          where: { id: el.id }
        })
        return false // 返回 false 以过滤掉该元素
      }
      return true // 返回 true 以保留该元素
    })
    if (dogs.length == 0) {
      Send(Text('农场还未有圈养的狗狗\n————————————\n[@机器人 /购买+狗狗名]'))
      return
    }

    const txt = useParse(e.Megs, 'Text')
    const name = txt.replace(/^(\/|#)?闲置/, '')
    const findDog = dogs.find(item => item['good.name'] == name)
    if (!findDog) {
      Send(
        Text(
          `农场里没有狗狗${findDog['good.name']}\n————————————\n[@机器人 /购买+狗狗名]`
        )
      )

      return
    }
    const { minutes } = Formats.formatBbsTime(
      new Date().getTime(),
      findDog.endAt
    ) // 距离饥饿的剩余时间
    if (minutes <= 0) {
      Send(Text(`你的${findDog['good.name']}正在挨饿，无法出门`))

      return
    }
    if (findDog.state == 0) {
      Send(Text(`${findDog['good.name']}不在农田里`))

      return
    }
    // 闲置指定狗狗
    await DB.user_dog.update(
      { state: 0 },
      { where: { uid: UID, id: findDog.id } }
    )
    //
    Send(Text(`${findDog['good.name']}回来啦`))

    return
  },
  'message.create',
  /^(\/|#)?闲置[\u4e00-\u9fa5]+$/
)
