import { user_bag } from '@src/db/index.js'
import { bagSize } from '../config/index.js'

/**
 *
 * @param UID
 * @returns
 */
export async function getLength(UID: string) {
  return await user_bag.count({
    where: {
      uid: UID
    }
  })
}

/**
 * 检查储物袋是否已满
 * @param UID
 * @returns
 */
export async function backpackFull(UID: string, grade: number) {
  const length = await getLength(UID)
  const size = grade * bagSize
  const n = size - length
  // 至少有空位置的时候返回n
  return n >= 1 ? n : false
}

/**
 * 给UID添加物品
 * @param uid
 * @param arr
 * @returns
 */
export async function addBagThing(
  uid: string,
  grade: number /* home_grade */,
  arr: { name: string; acount: number; typing: number }[],
  // 是否可以出售
  sell: number = 0
) {
  for (const { name, acount, typing } of arr) {
    const length = await user_bag.count({ where: { uid, name } })

    // 当前储物袋格子已到极限
    if (length >= grade * bagSize) break

    // 查找物品
    const existingItem = await user_bag
      .findOne({
        where: { uid, name, typing, sell }
      })
      .then(data => data.dataValues)

    if (!existingItem) {
      // 如果物品不存在，则创建新数据条目
      await user_bag.create({ uid, name, typing, sell, acount })
      continue
    }

    const size = Number(existingItem.acount) + Number(acount)

    // 更新数据
    await user_bag.update(
      { acount: size },
      { where: { uid, name, typing, sell } }
    )
  }
  return
}

/**
 * 给UID减少物品
 * @param UID
 * @param arr
 * @returns
 */
export async function reduceBagThing(
  UID: string,
  arr: {
    name: string
    acount: number
  }[],
  // 是否是可出售物品
  sell: number = 1
) {
  for (const { name, acount } of arr) {
    const data = await user_bag
      .findOne({
        where: {
          uid: UID,
          name,
          sell
        }
      })
      .then(res => res.dataValues)
    // 不存在该物品
    if (!data) continue
    // 计算
    const ACCOUNT = Number(data.acount) - Number(acount)
    // 有效数量
    if (ACCOUNT >= 1) {
      await user_bag.update(
        {
          acount: ACCOUNT
        },
        {
          where: {
            uid: UID,
            name: name,
            sell
          }
        }
      )
      continue
    }
    // 删除该物品
    await user_bag.destroy({
      where: {
        uid: UID,
        name: name,
        sell
      }
    })
  }
  return true
}
