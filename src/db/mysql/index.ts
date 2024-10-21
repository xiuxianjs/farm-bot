import { getConfig } from 'alemonjs'
import { Sequelize } from 'sequelize'
const config = getConfig()
const MDB = config.value.db
export const sequelize = new Sequelize(
  process.env?.APP_MYSQL_DATABASE ?? MDB?.database,
  process.env?.APP_MYSQL_USER ?? MDB?.user,
  process.env?.APP_MYSQL_PASSWORD ?? MDB?.password,
  {
    host: process.env?.APP_MYSQL_HOST ?? MDB?.host,
    port: Number(process.env?.APP_MYSQL_PROT ?? MDB?.port),
    dialect: 'mysql',
    logging: false // 禁用日志记录
  }
)
export const TableConfig = {
  freezeTableName: true, //不增加复数表名
  createdAt: false, //去掉
  updatedAt: false //去掉
}
export { Op, literal } from 'sequelize'
