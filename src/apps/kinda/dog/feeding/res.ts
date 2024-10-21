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
    const name = txt.replace(/^(\/|#)?喂养/, '')

    const dog = dogs.find(item => item['good.name'] == name)
    if (!dog) {
      Send(
        Text(
          `农场里没有狗狗${dog['good.name']}\n————————————\n[@机器人 /购买+狗狗名]`
        )
      )
      return
    }

    const bags: DB.UserBagType[] = (await DB.user_bag.findAll({
      where: {
        uid: UID,
        typing: 4,
        sell: 1
      },
      raw: true,
      include: [{ model: DB.goods }]
    })) as any

    if (bags.length == 0) {
      Send(Text('家里没有狗粮了'))
      return
    }

    const now = new Date().getTime()
    const isjust = now - dog.startAt
    if (GameApi.Config.dogMinTime > isjust) {
      Send(
        Text(
          `请${GameApi.Method.convertTime(
            GameApi.Config.dogMinTime - isjust
          )}后再来`
        )
      )

      return
    }

    let exp = dog.exp

    const bag = bags[0]

    if (dog.endAt < now) {
      Send(Text(`${dog['good.name']}喂养成功\n狗狗状态已恢复!`))
    } else {
      exp += GameApi.Config.dogUpExp
      Send(
        Text(`${dog['good.name']}喂养成功\n狗狗exp+${GameApi.Config.dogUpExp}`)
      )
    }

    await DB.user_dog.update(
      {
        startAt: now,
        endAt: now + bag['good.time'],
        exp
      },
      { where: { id: dog.id } }
    )

    await GameApi.bag.reduceBagThing(UID, [
      {
        name: bag.name,
        acount: 1
      }
    ])

    return
  },
  'message.create',
  /^(\/|#)?喂养/
)
