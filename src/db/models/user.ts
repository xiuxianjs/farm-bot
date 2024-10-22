import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user = <
  ModelStatic<
    Model<{
      id: number
      uid: string //编号
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
    }>
  >
>sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER, // bigint
      primaryKey: true
    },
    uid: DataTypes.STRING, // string
    name: DataTypes.STRING, //  string
    avatar: DataTypes.STRING, //  string
    autograph: DataTypes.STRING, //  string
    phone: DataTypes.INET, //  bigint
    species: DataTypes.INTEGER, //  bigint
    coins: DataTypes.INTEGER, // bigint
    coins_limit: DataTypes.INTEGER, // bigint
    exp: DataTypes.INTEGER, // bigint
    grade: DataTypes.INET, // int
    state: DataTypes.INET, // int
    createAt: DataTypes.INTEGER // bigint
  },
  TableConfig
)
