import { getConfig } from 'alemonjs'
import { Sequelize } from 'sequelize'
const config = getConfig()
const db = config.value.db3
export const sequelize = new Sequelize(db?.database, db?.user, db?.password, {
  host: db?.host,
  port: Number(db?.port),
  dialect: 'mysql',
  logging: false // 禁用日志记录
})
export const TableConfig = {
  freezeTableName: true, //不增加复数表名
  createdAt: false, //去掉
  updatedAt: false //去掉
}
export { Op, literal } from 'sequelize'
