import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 境界表
 */
export const goods = <ModelStatic<Model<GoodsType>>>sequelize.define(
  'goods',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    typing: DataTypes.INET,
    time: DataTypes.INTEGER,
    buff: DataTypes.INTEGER,
    cycle: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    selling_price: DataTypes.INET
  },
  TableConfig
)
export interface GoodsType {
  id: number
  name: string
  typing: number
  time: number
  buff: number
  price: number
  cycle: number
  selling_price: number
}
