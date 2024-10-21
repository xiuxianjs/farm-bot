import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 境界表
 */
export const levels = <ModelStatic<Model<LevelsType>>>sequelize.define(
  'levels',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    grade: DataTypes.INET,
    typing: DataTypes.INET,
    buff: DataTypes.INTEGER,
    exp_need: DataTypes.INTEGER,
    species_need: DataTypes.INTEGER
  },
  TableConfig
)
export interface LevelsType {
  id: number
  name: string
  typing: number
  buff: number
  grade: number
  exp_need: number
  species_need: number
}
