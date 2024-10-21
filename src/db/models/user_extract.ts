import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户提现表
 */
export const user_extract = <ModelStatic<Model<UserExtractType>>>(
  sequelize.define(
    'user_extract',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uid: DataTypes.STRING,
      price: DataTypes.INTEGER,
      createAt: DataTypes.INTEGER, // new Date().getTime()
      confirmAt: DataTypes.INTEGER,
      state: DataTypes.INET
    },
    TableConfig
  )
)
export interface UserExtractType {
  id: number
  uid: string
  price: number
  createAt: number
  confirmAt: number
  state: number
}
