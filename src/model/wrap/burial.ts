import { Redis } from '../../db/redis/index.js'
import { convertTime } from './method.js'
import { CD_MAP, ReadiName } from '../config/index.js'

import { CDTIME } from '../config/index.js'

/**
 * 设置redis
 * @param UID 用户
 * @param CDID key
 * @param CDTime 时间搓
 */
export function set(UID: string, CDID: number) {
  Redis.set(
    `${ReadiName}:${UID}:${CDID}`,
    JSON.stringify({
      val: new Date().getTime(),
      expire: CDTIME[CDID] * 60000
    })
  )
}

/**
 * @param UID
 * @param CDID
 */
export function del(UID: string, CDID: number) {
  Redis.del(`${ReadiName}:${UID}:${CDID}`)
}

/**
 *
 * @param UID
 * @param CDID
 * @returns
 */
export async function get(UID: string, CDID: number) {
  return await Redis.get(`${ReadiName}:${UID}:${CDID}`)
}

/**
 *
 * @param UID
 * @param CDID
 * @returns
 */
export async function cooling(UID: string, CDID: number) {
  const data = await Redis.get(`${ReadiName}:${UID}:${CDID}`)
  // 设置了时间
  if (data) {
    // 得到数据
    const { val, expire } = JSON.parse(data)
    // 现在的时间
    const NowTime = new Date().getTime()
    const onTime = val + expire
    if (NowTime >= onTime) {
      Redis.del(`${ReadiName}:${UID}:${CDID}`)
      return {
        state: 2000,
        msg: '通过'
      }
    }
    // 剩余时间计算
    const theTime = onTime - NowTime
    return {
      state: 4001,
      msg: `${CD_MAP[CDID]}冷却:${convertTime(theTime)}`
    }
  }
  // 没设置时间
  return {
    state: 2000,
    msg: '通过'
  }
}
