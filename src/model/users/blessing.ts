import { goods, user, user_bag, user_home } from '@src/db/index'
/**
 * 读取用户所有数据
 * @param UID
 * @returns
 */
export async function read(UID: string) {
  const data = (await user_home.findOne({
    where: {
      uid: UID
    },
    include: [{ model: user }],
    raw: true
  })) as any
  return data
}

/**
 * 读取背包所有数据
 */
export async function readbag(UID: string) {
  const data = (await user_bag.findAll({
    where: {
      uid: UID
    },
    include: [{ model: goods }],
    raw: true
  })) as any
  return data
}
