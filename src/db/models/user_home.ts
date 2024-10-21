import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户房子表
 */
export const user_home = <ModelStatic<Model<UserHomeType>>>sequelize.define(
  'user_home',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    grade: DataTypes.INET,
    exp: DataTypes.INTEGER
  },
  TableConfig
)
export interface UserHomeType {
  uid: string //用户编号
  grade: number //等级
  exp: number //当前经验
}
