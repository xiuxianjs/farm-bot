import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户狗狗培养表
 */
export const user_dog = <ModelStatic<Model<UserDogType>>>sequelize.define(
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
    startAt: DataTypes.INTEGER, // 投喂时间
    endAt: DataTypes.INTEGER, // 饥饿时间
    state: DataTypes.INET // 是否被放置
  },
  TableConfig
)
export interface UserDogType {
  id: number
  uid: string //编号
  gid: number // 物品外键
  exp: number // 累计经验
  grade: number // 等级
  startAt: number // 投喂时间
  endAt: number // 饥饿时间
  state: number // 是否被放置
}
