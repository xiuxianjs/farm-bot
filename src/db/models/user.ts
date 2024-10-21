import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user = <ModelStatic<Model<UserType>>>sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER, // bigint
      primaryKey: true
    },
    uid: DataTypes.STRING, //编号 string
    pid: DataTypes.STRING, //二级编号 string
    name: DataTypes.STRING, // 昵称 string
    avatar: DataTypes.STRING, // 头像 string
    autograph: DataTypes.STRING, // 个性签名 string
    phone: DataTypes.INET, // bigint
    species: DataTypes.INTEGER, // bigint
    coins: DataTypes.INTEGER, // bigint
    coins_limit: DataTypes.INTEGER, // bigint
    exp: DataTypes.INTEGER, // bigint
    grade: DataTypes.INET, // int
    state: DataTypes.INET, // int
    createAt: DataTypes.INTEGER, // bigint
    invite_code: DataTypes.STRING, // 邀请码 string
    referrer: DataTypes.STRING, // 推荐人 string
    integral: DataTypes.INTEGER // 拉人累积量
  },
  TableConfig
)
export interface UserType {
  id: number
  uid: string //编号
  pid: string //二级编号
  name: string // 道号
  avatar: string // 头像地址
  autograph: string // 道宣
  phone: number // 手机号
  species: number //财富
  coins: number // 商店已获得金币累计，每日0点重置为0
  coins_limit: number // 商店金币每日出售上限
  exp: number // 升级所需经验
  grade: number
  state: number //状态封号处理
  createAt: number //创建时间
  invite_code: string // 邀请码
  referrer: string // 推荐人
  integral: number // 拉人累计量
}
