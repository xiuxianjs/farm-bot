import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
/**
 * 物品表
 */
export const goods = <
  ModelStatic<
    Model<{
      id: number
      name: string
      typing: number
      time: number
      buff: number
      price: number
      cycle: number
      selling_price: number
    }>
  >
>sequelize.define(
  'goods',
  {
    // 自增
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    // 物品名
    name: DataTypes.STRING,
    // 物品类型 0 种子  1土壤  3 狗狗 4 狗粮 5 道具
    typing: DataTypes.INET,
    /**
     * time  
------- 种子：要多久可以成熟（单位：毫秒）
------- 土壤：0 
------- 狗狗：最饱度，也就是最多能增加到多久不饿 （单位：毫秒）
------- 狗粮：增加不饥饿时间 （单位：毫秒
     */
    time: DataTypes.INTEGER,
    /**
     * buff 
-------种子：10 成熟后用户所得经验 
-------土壤：60000  最迟浇水延长 （单位：毫秒）
-------狗狗：10  狗狗防偷概率 （单位%）
-------狗粮：0 
     */
    buff: DataTypes.INTEGER,
    /**
     *cycle 
-------种子：种子浇水周期 (单位：毫秒)
-------土壤： 
-------狗狗： 
-------狗粮： 
     */
    cycle: DataTypes.INTEGER,
    /**
     * 购买价格
     */
    price: DataTypes.INTEGER,
    /**
     * 售出价格
     */
    selling_price: DataTypes.INET
  },
  TableConfig
)
