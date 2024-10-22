import { DB, GameApi, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const uData = await DB.user_home
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(data => data.dataValues)

    const Send = useSend(e)

    if (!(await GameApi.bag.backpackFull(UID, uData.grade))) {
      Send(Text('仓库容量不足'))
      return
    }

    const txt = useParse(e.Megs, 'Text')

    const [name, s2] = txt.replace(/(#|\/)?购买/, '').split('*')

    if (name == '无') return

    const acount: number = Number(s2) || 1 //数量

    const { shop, dog, dogfoot, farmland } = await GameApi.Shop.isbuy(UID)

    // 找到物品
    const findgoood = shop
      .concat(dog, dogfoot, farmland)
      .find(item => item.name == name)

    if (!findgoood) {
      Send(Text(`商店没有[${name}]`))
      return
    }

    const user: any = await DB.user_home.findOne({
      where: {
        uid: UID
      },
      include: [{ model: DB.user }],
      raw: true
    })

    // 狗子要到狗子表
    if (findgoood.typing == 3) {
      if (user['user.species'] < findgoood.price) {
        Send(Text('金币不足'))
        return
      }
      // 找到狗子
      const dogs: any = await DB.user_dog.findOne({
        where: { uid: UID, gid: findgoood.id },
        raw: true
      })
      if (!dogs) {
        const now = new Date().getTime()
        await DB.user_dog.create({
          uid: UID,
          gid: findgoood.id,
          startAt: now,
          endAt: now + findgoood.time
        })
        // 扣钱
        await DB.user.update(
          { species: findgoood.price },
          { where: { uid: UID } }
        )
        Send(
          Text(
            [
              `购买完成,花费了${findgoood.price}`,
              `\n————————————`,
              `\n[@机器人 /我的仓库]`,
              `\n[@机器人 /种植+种子名]`
            ].join('\n')
          )
        )
      } else {
        Send(Text('家里已经有' + findgoood.name))
      }
      return
    }

    if (findgoood.typing == 1) {
      // 查看自身等级
      const userData: any = await DB.user.findOne({
        where: {
          uid: UID
        },
        include: [
          {
            model: DB.levels
          }
        ],
        raw: true
      })

      const size = userData['level.buff']
      // 看看目前多少块田
      const count = await DB.user_farmland.count({
        where: {
          uid: UID
        }
      })
      if (count >= size) {
        Send(
          Text(
            ['土壤可拥有数已达上限', `————————————`, '[@机器人 /升级]'].join(
              '\n'
            )
          )
        )
        return
      }

      const ac = count - size

      if (acount > ac) {
        Send(
          Text(
            [
              '最多还能购买' + ac + '块土壤',
              `————————————`,
              '[@机器人 /升级]'
            ].join('\n')
          )
        )
        return
      }

      // 看看可以买几个
      for (let i = 0; i < ac; i++) {
        await DB.user_farmland.create({
          uid: UID
        })
      }

      Send(Text(`成功购买[${findgoood.name}]*${ac}`))

      return
    }

    const money = findgoood.price * acount

    if (user['user.species'] < money) {
      Send(Text(`金币不足`))

      return
    }

    const species = user['user.species'] - money

    if (findgoood.typing == 0) {
      await GameApi.bag.addBagThing(
        UID,
        uData.grade,
        [
          {
            name: findgoood.name,
            acount: acount,
            typing: findgoood.typing
          }
        ],
        // 种子不可出售
        0
      )
    } else {
      // 购买农田是有等级限制的

      await GameApi.bag.addBagThing(
        UID,
        uData.grade,
        [
          {
            name: findgoood.name,
            acount: acount,
            typing: findgoood.typing
          }
        ],
        //
        1
      )
    }

    await DB.user.update({ species: species }, { where: { uid: UID } })

    Send(
      Text(
        [
          `购买完成,花费了${money}`,
          `————————————`,
          '[@机器人 /我的背包]',
          '[@机器人 /种植+种子名]'
        ].join('\n')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?购买(.*)$/
)
