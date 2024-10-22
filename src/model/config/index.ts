// redis前缀
export const ReadiName: string = 'farm'
// 自定义冷却反馈
export const CD_MAP: {
  [key: number]: string
} = {
  0: '偷菜',
  1: '列表',
  4: '翻阅'
}
/** 每升一级可查看的物品 */
export const seenum: {
  [key: number]: number
} = {
  1: 6,
  2: 13,
  3: 21,
  4: 29,
  5: 41,
  6: 50,
  7: 59,
  8: 66,
  9: 70,
  10: 80
}
/* 物品类型 */
export const typings: {
  [key: number]: string
} = {
  0: '种子',
  1: '土壤',
  3: '狗狗',
  4: '狗粮',
  5: '道具'
}
/* 金币|财富 */
export const coin: number = 10
/* 签到给予经验值 */
export const empirical: number = 10
/* 填写邀请码的等级上限，默认为5级 */
export const codeMaxGrade: number = 3
/* 邀请成功送10财富值 */
export const inviteSpecies: number = 20
/** 最低提现额度 */
export const minimumPayout: number = 500
/* 每级背包格数 */
export const bagSize: number = 10
/** 狗狗饿死的时间：小时*/
export const dogDeathTime: number = 12
/** 狗狗喂食至少间隔的时间：毫秒 */
export const dogMinTime: number = 20 * 60 * 1000
/** 狗狗喂养增加的经验：单次 */
export const dogUpExp: number = 10
/** 狗狗开始挨饿的剩余时间：分钟 */
export const starvingTime: number = 20
/** 最迟浇水时间：分 */
export const waterend: number = 30 * 60 * 1000
// 农田收割获得经验
export const farmlandExp: number = 10
// 用户收割获得经验 农田升级 可加倍
export const userExp: number = 10
//偷菜被发现扣除的金币
export const deduct: number = 10
/* 新用户金币 */
export const newUserSpecies: number = 10
/** 默认防偷倍率 */
export const prevent: number = 1

export const typingsMap: {
  [key: string]: string
} = {
  种子: '0',
  土壤: '1',
  狗狗: '3',
  狗粮: '4',
  道具: '5'
}

// CD time
export const CDTIME = {
  0: 1,
  1: 1,
  4: 1
}
