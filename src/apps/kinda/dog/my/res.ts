import { DB, isThereAUserPresent, GameApi, Formats } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const Send = useSend(e)

    let dogs: any[] = (await DB.user_dog.findAll({
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

    const msg: any = []
    dogs.forEach((dog, index) => {
      const time = Formats.formatBbsTime(new Date().getTime(), dog.endAt)
      const { hours, minutes } = GameApi.Method.calculateTimeDifference(
        new Date().getTime(),
        dog.endAt
      )
      const endtime = `${hours <= 0 ? '' : hours + '小时'}${
        minutes <= 0 ? '' : minutes + '分钟'
      }`
      let state = '良好'
      if (time.minutes < GameApi.Config.starvingTime) state = '饿了'
      if (time.minutes <= 0) state = '挨饿中'
      if (dog && dog['good.id']) {
        msg.push(
          ...[
            `名称: ${dog['good.name']}\n`,
            `饱度: ${endtime == '' ? '无' : endtime}\n`,
            `状态：${dog.state ? '在农田' : '在家里'}(${state})\n`,
            `等级：${dog['level.name']}\n`,
            `经验：${dog.exp}/${dog['level.exp_need']}`
          ]
        )
        if (dogs.length - 1 > index) {
          msg.push('\n--------\n')
        }
      }
    })

    //
    Send(Text(['[我的狗狗]\n', ...msg].join('')))

    return
  },
  'message.create',
  /^(\/|#)?我的狗狗$/
)
