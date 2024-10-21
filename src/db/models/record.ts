import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 管理员充值表
 */
export const record = <ModelStatic<Model<RecordType>>>sequelize.define(
  'record',
  {
    id: {
      type: DataTypes.INTEGER, // bigint
      primaryKey: true
    },
    uid: DataTypes.STRING, //  string
    gid: DataTypes.INTEGER, // bigint
    price: DataTypes.INTEGER, // bigint
    createAt: DataTypes.INTEGER // int
  },
  TableConfig
)
export interface RecordType {
  id: number
  uid: string //编号
  price: number // 充值金额
  createAt: number // 等级
}
