import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户背包
 */
export const user_bag = <
  ModelStatic<
    Model<{
      // 编号
      id: number
      // 用户id
      uid: string
      // 物品类型id
      typing: number
      // 物品名
      name: string
      // 物品出售价格
      sell: number
      // 物品数量
      acount: number
    }>
  >
>sequelize.define(
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
