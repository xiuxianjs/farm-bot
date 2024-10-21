import data from '@src/assets/config/farm.json'
// redis前缀
export const ReadiName: string = data.ReadiName
// 自定义冷却反馈
export const CD_MAP: {
  [key: string]: string
} = data.CD
/** 每升一级可查看的物品 */
export const seenum: {
  [key: string]: number
} = data.seenum
/* 物品类型 */
export const typings: {
  [key: string]: string
} = data.typings
/* 金币|财富 */
export const coin: number = data.coin
/* 签到给予经验值 */
export const empirical: number = data.empirical
/* 填写邀请码的等级上限，默认为5级 */
export const codeMaxGrade: number = data.codeMaxGrade
/* 邀请成功送10财富值 */
export const inviteSpecies: number = data.inviteSpecies
/** 最低提现额度 */
export const minimumPayout: number = data.minimumPayout
/* 每级背包格数 */
export const bagSize: number = data.bagSize
/** 狗狗饿死的时间：小时*/
export const dogDeathTime: number = data.dogDeathTime
/** 狗狗喂食至少间隔的时间：毫秒 */
export const dogMinTime: number = data.dogMinTime * 60 * 1000
/** 狗狗喂养增加的经验：单次 */
export const dogUpExp: number = data.dogUpExp
/** 狗狗开始挨饿的剩余时间：分钟 */
export const starvingTime: number = data.starvingTime
/** 最迟浇水时间：分 */
export const waterend: number = data.waterend * 60 * 1000
// 农田收割获得经验
export const farmlandExp: number = data.farmlandExp
// 用户收割获得经验 农田升级 可加倍
export const userExp: number = data.userExp
//偷菜被发现扣除的金币
export const deduct: number = data.deduct

/* 新用户金币 */
export const newUserSpecies: number = data.newUserSpecies

/** 默认防偷倍率 */
export const prevent: number = data.prevent

export const typingsMap: {
  [key: string]: string
} = data.typingsMap

// CD time
export const CDTIME = data.CDTIME
