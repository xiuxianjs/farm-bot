import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户背包
 */
export const user_bag = <ModelStatic<Model<UserBagType>>>sequelize.define(
  'user_bag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    typing: DataTypes.INET,
    name: DataTypes.STRING,
    sell: DataTypes.INET,
    acount: DataTypes.INTEGER
  },
  TableConfig
)
export interface UserBagType {
  id: number
  uid: string
  typing: number
  name: string
  sell: number
  acount: number
}
