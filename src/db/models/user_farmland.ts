import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户农田
 */
export const user_farmland = <ModelStatic<Model<UserFarmlandType>>>(
  sequelize.define(
    'user_farmland',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uid: DataTypes.STRING,
      gid: DataTypes.INTEGER,
      grade: DataTypes.INET,
      tid: DataTypes.INTEGER,
      startAt: DataTypes.INTEGER,
      // 浇水时间
      time: DataTypes.INTEGER,
      state: DataTypes.INTEGER,
      endAt: DataTypes.INTEGER,
      exp: DataTypes.INTEGER,
      createAt: DataTypes.INTEGER
    },
    TableConfig
  )
)
export interface UserFarmlandType {
  id: number
  uid: string
  gid: number
  grade: number
  tid: number
  startAt: number
  time: number
  state: number
  endAt: number
  exp: number
  createAt: number
}
