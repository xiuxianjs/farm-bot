/**
 *
 * @param uid 玩家uid
 * @param DB 数据库接口
 * @returns 根据等级可查看的商店物品
 */
import { goods, user } from '@src/db'
import { seenum } from './config'

export async function isbuy(uid: string) {
  const users = await user
    .findOne({
      where: { uid }
    })
    .then(data => data.dataValues)
  // 根据用户等级得到种子
  const shop = await goods
    .findAll({
      where: { typing: 0 },
      limit: seenum[users.grade] ?? 99
    })
    .then(res => res.map(item => item.dataValues))
  // 得到狗粮
  const dogfoot = await goods
    .findAll({
      where: { typing: 4 }
    })
    .then(res => res.map(item => item.dataValues))
  // 根据用户等级 得到狗子列表
  const dog = await goods
    .findAll({
      where: { typing: 3 },
      limit: users.grade
    })
    // 根据用户等级 得到农田列表
    .then(res => res.map(item => item.dataValues))
  const farmland = await goods
    .findAll({
      where: { typing: 1 },
      limit: users.grade
    })
    .then(res => res.map(item => item.dataValues))
  return { shop, dog, dogfoot, farmland }
}
