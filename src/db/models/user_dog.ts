import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户狗狗培养表
 */
export const user_dog = <
  ModelStatic<
    Model<{
      // 编号
      id: number
      // 用户编号
      uid: string
      // 物品外键
      gid: number
      // 累计经验
      exp: number
      // 等级
      grade: number
      // 投喂时间
      startAt: number
      // 饥饿时间
      endAt: number
      // 是否被放置
      state: number
    }>
  >
>sequelize.define(
  'user_dog',
  {
    id: {
      type: DataTypes.INTEGER, // bigint
      primaryKey: true
    },
    uid: DataTypes.STRING, //  string
    gid: DataTypes.INTEGER, // bigint
    exp: DataTypes.INTEGER, // bigint
    grade: DataTypes.INET, // int
    startAt: DataTypes.INTEGER, // bigint
    endAt: DataTypes.INTEGER, // bigint
    state: DataTypes.INET // int
  },
  TableConfig
)
