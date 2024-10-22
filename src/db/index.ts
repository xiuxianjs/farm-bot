/**
 * ****
 * 框架函数
 * *****
 */
export * from './mysql/index.js'
/**
 * 固定数据
 */
export * from './models/goods.js'
export * from './models/levels.js'
/**
 * 用户相关
 */
export * from './models/user.js'
export * from './models/user_dog.js'
export * from './models/user_home.js'
export * from './models/user_sign.js'
export * from './models/user_farmland.js'
export * from './models/user_bag.js'
/**
 * 确定关联关系
 */
import { user } from './models/user.js'
import { user_bag } from './models/user_bag.js'
import { user_dog } from './models/user_dog.js'
import { user_farmland } from './models/user_farmland.js'
import { user_home } from './models/user_home.js'
import { user_sign } from './models/user_sign.js'
import { goods } from './models/goods.js'
import { levels } from './models/levels.js'
//
user.belongsTo(levels, { foreignKey: 'grade', targetKey: 'grade' })
// //
user_dog.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
user_dog.belongsTo(goods, { foreignKey: 'gid', targetKey: 'id' })
user_dog.belongsTo(levels, { foreignKey: 'grade', targetKey: 'grade' })
user_home.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
user_home.belongsTo(levels, { foreignKey: 'grade', targetKey: 'grade' })
user_sign.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
//
user_farmland.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
user_farmland.belongsTo(goods, {
  foreignKey: 'gid',
  targetKey: 'id',
  as: 'goods_gid' // 农田
})
user_farmland.belongsTo(goods, {
  foreignKey: 'tid',
  targetKey: 'id',
  as: 'goods_tid' // 种子
})
user_farmland.belongsTo(levels, { foreignKey: 'grade', targetKey: 'grade' })
//
user_bag.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
user_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
//
user_home.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
user_home.belongsTo(levels, { foreignKey: 'grade', targetKey: 'grade' })
