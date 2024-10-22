import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 境界表
 */
export const levels = <
  ModelStatic<
    Model<{
      id: number
      name: string
      typing: number
      buff: number
      grade: number
      exp_need: number
      species_need: number
    }>
  >
>sequelize.define(
  'levels',
  {
    /**
     * 自增
     */
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    /**
     * 等级名称
     */
    name: DataTypes.STRING,
    /**
     * 类型   0用户  1家园(背包) 2土壤 3狗狗
     */
    typing: DataTypes.INET,
    /**
     * 等级
     */
    grade: DataTypes.INET,
    /**
     * buff
--------用户：可拥有的土壤上限
--------背包：
--------土壤：
--------狗狗：
     */
    buff: DataTypes.INTEGER,
    /**
     * 下一等级升级需要的经验值
     */
    exp_need: DataTypes.INTEGER,
    /**
     * 下一级升级需要的金币
     */
    species_need: DataTypes.INTEGER
  },
  TableConfig
)
