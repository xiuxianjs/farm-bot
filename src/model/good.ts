import { goods, type GoodsType, literal, UserBagType } from '@src/db/index'
import { WhereOptions } from 'sequelize'

/**
 * 转换函数集
 */
const map = {
  //  0 种子
  0: (item: GoodsType, name: string) => {
    return `🔶种子[${item.name}]${name}${item.price}\n(成熟:${Math.floor(
      item.time / 1000 / 60
    )}分|周期:${Math.floor(item.cycle / 1000 / 60)}分|经验:${item.buff})`
  },
  // 土壤
  1: (item: GoodsType, name: string) => {
    return `🔶土壤[${item.name}]${name}${item.price}\n(耐干旱:${Math.floor(
      item.buff / 1000 / 60
    )}分)`
  },
  // 狗狗
  3: (item: GoodsType, name: string) => {
    return `🔶狗狗[${item.name}]${name}${item.price}\n(最饱度:${Math.floor(
      item.time / 1000 / 60
    )}分|防偷资质:${item.buff})`
  },
  // 狗粮
  4: (item: GoodsType, name: string) => {
    return `🔶狗粮[${item.name}]${name}${item.price}\n(喂饱度:${Math.floor(
      item.time / 1000 / 60
    )}分)`
  }
}

/**
 * 转换函数集
 */
const mapByUser = {
  //  0 成熟物
  0: (item: UserBagType, name: string) => {
    return `🔶作物[${item.name}]${name}${item['good.selling_price']}\n(数量:${item.acount})`
  },
  // 土壤
  1: (item: UserBagType, name: string) => {
    return `🔶土壤[${item.name}]${name}${item['good.selling_price']}\n(数量:${item.acount})`
  },
  // 狗狗
  3: (item: UserBagType, name: string) => {
    return `🔶狗狗[${item.name}]${name}${item['good.selling_price']}\n(数量:${item.acount})`
  },
  // 狗粮
  4: (item: UserBagType, name: string) => {
    return `🔶狗粮[${item.name}]${name}${item['good.selling_price']}\n(数量:${item.acount})`
  }
}

/**
 * 名称信息转换
 * @param list
 * @param param1
 * @returns
 */
export function getListMsg(list: GoodsType[], name = '￥') {
  // 存储转换
  const msg: string[] = []
  // 循环转换
  for (const item of list) {
    // 执行匹配并推送数据
    msg.push(map[item?.typing](item, name))
  }
  // 返回
  return msg
}

/**
 * 名称信息转换
 * @param list
 * @param param1
 * @returns
 */
export function getListMsgByUser(list: UserBagType[], name = '￥') {
  // 存储转换
  const msg: string[] = []
  // 循环转换
  for (const item of list) {
    // 执行匹配并推送数据
    msg.push(mapByUser[item?.typing](item, name))
  }
  // 返回
  return msg
}

/**
 * 得到随即名称
 * @param where
 * @returns
 */
export async function getRandomThing(where: WhereOptions<GoodsType>) {
  const data: GoodsType | null = await goods
    .findOne({
      where,
      // 进行随机排序
      order: literal('RAND()')
    })
    .then(data => data.dataValues)
  return data
}

/**
 * 搜索指定名称信息
 * @param name
 * @returns
 */
export async function searchAllThing(name: string) {
  const da: GoodsType = await goods
    .findOne({
      where: {
        name
      }
    })
    .then(data => data.dataValues)
  return da
}
