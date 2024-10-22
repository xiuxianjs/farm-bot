import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户房子表
 */
export const user_home = <
  ModelStatic<
    Model<{
      id: number
      //用户编号
      uid: string
      //等级
      grade: number
      //当前经验
      exp: number
    }>
  >
>sequelize.define(
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
