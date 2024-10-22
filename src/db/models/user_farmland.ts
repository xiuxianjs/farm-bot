import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 用户农田
 */
export const user_farmland = <
  ModelStatic<
    Model<{
      // 编号
      id: number
      // 用户id
      uid: string
      // 作物
      gid: number
      // 等级
      grade: number
      // 作物类型id
      tid: number
      // 开始作物时间
      startAt: number
      // 浇水时间
      time: number
      // 作物状态
      state: number
      // 结束作物时间
      endAt: number
      // 经验
      exp: number
      // 创建时间
      createAt: number
    }>
  >
>sequelize.define(
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
