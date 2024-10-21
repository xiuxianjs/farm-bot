import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户签到表
 */
export const user_sign = <ModelStatic<Model<UserSignType>>>sequelize.define(
  'user_sign',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    continuous: DataTypes.INET,
    day: DataTypes.INET,
    math: DataTypes.INET,
    updateAt: DataTypes.STRING
  },
  TableConfig
)
export interface UserSignType {
  id: number
  uid: string
  continuous: number
  day: number
  math: number
  updateAt: string
}
