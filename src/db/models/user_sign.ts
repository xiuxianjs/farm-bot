import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户签到表
 */
export const user_sign = <
  ModelStatic<
    Model<{
      // 编号
      id: number
      // 用户id
      uid: string
      // 连续签到天数
      continuous: number
      // 今日签到天数
      day: number
      // 今日签到月
      math: number
      // 最后一次签到时间
      updateAt: string
    }>
  >
>sequelize.define(
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
