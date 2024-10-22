import { user, user_farmland, user_home, user_sign } from '@src/db/index'
import { newUserSpecies } from './config'

import { Anyarray } from './wrap/method'
/**
 * 创建用户信息
 * @param UID 用户编号
 * @param user_avatar 用户头像
 * @returns
 */
export async function setPlayer(
  UID: string,
  user_avatar: string,
  name?: string
) {
  // 用户数据
  await user.create({
    uid: UID, //编号
    name:
      name ??
      Anyarray(['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']) +
        Anyarray([
          '子',
          '丑',
          '寅',
          '卯',
          '辰',
          '巳',
          '午',
          '未',
          '申',
          '酉',
          '戌',
          '亥'
        ]), // 道号
    avatar: user_avatar, // 头像地址
    autograph: '无', // 签名
    phone: 999999, // 手机号
    species: newUserSpecies, //财富
    exp: 10, // 升级所需经验
    state: 1, // 状态
    createAt: new Date().getTime() //创建时间
  })
  // 家园
  await user_home.create({
    uid: UID, //用户编号
    grade: 1, //等级
    exp: 0 //当前经验
  })
  // 农田一块
  await user_farmland.create({
    uid: UID
  })
  // 签到
  await user_sign.create({
    uid: UID
  })
  return
}
