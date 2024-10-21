/**
 *
 * @param uid 玩家uid
 * @param DB 数据库接口
 * @returns 根据等级可查看的商店物品
 */
import { goods, GoodsType, user, type UserType } from '@src/db'
import { seenum } from './config'

export async function isbuy(uid: string) {
  const users: UserType = await user
    .findOne({
      where: { uid }
    })
    .then(data => data.dataValues)
  // 根据用户等级得到种子
  const shop: GoodsType[] = (await goods.findAll({
    where: { typing: 0 },
    raw: true,
    limit: seenum[users.grade] ?? 99
  })) as any
  // 得到狗粮
  const dogfoot: GoodsType[] = (await goods.findAll({
    where: { typing: 4 },
    raw: true
  })) as any
  // 根据用户等级 得到狗子列表
  const dog: GoodsType[] = (await goods.findAll({
    where: { typing: 3 },
    raw: true,
    limit: users.grade
  })) as any
  // 根据用户等级 得到农田列表
  const farmland: GoodsType[] = (await goods.findAll({
    where: { typing: 1 },
    raw: true,
    limit: users.grade
  })) as any
  return { shop, dog, dogfoot, farmland }
}
