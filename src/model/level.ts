import { levels, user, user_home, user_farmland, user_dog } from '../db/index'

/**
 * 查看指定类型境界
 * @param typing
 * @returns
 */
export async function Search(typing: number): Promise<any[]> {
  return (await levels.findAll({
    where: {
      typing
    },
    order: [['grade', 'ASC']], //从小到大
    raw: true
  })) as any
}

/**
 * 查看指定境界
 * @param typing
 * @param grade
 * @returns
 */
export async function SearchByGrade(
  typing: number,
  grade: number
): Promise<any[]> {
  return (await levels.findAll({
    where: {
      typing,
      grade
    },
    raw: true
  })) as any
}

/**
 * 0 用户等级  --- 影响 商品解锁
 * 1 家园等级 --- 影响 背包大小
 * 2 农田等级 --- 升级的是品质
 * 3 狗子等级 --- 升级的是品质
 */
export const LevelsMap = {
  0: async (uid: string, size: number) => {
    const data = (await user.findOne({
      where: {
        uid
      },
      include: [
        {
          model: levels,
          where: {
            typing: 0
          }
        }
      ],
      raw: true
    })) as any
    const max = await Search(0).then(res => res[res.length - 1])
    if (data.grade >= max.grade) return '已满级'
    if (data.exp < data['level.exp_need']) {
      return `经验不足(${data.exp}/${data['level.exp_need']})`
    }
    if (data.species < data['level.species_need']) {
      return `金币不足(${data.species}/${data['level.species_need']})`
    }
    await user.update(
      {
        exp: data.exp - data['level.exp_need'],
        species: data.species - data['level.species_need'],
        grade: data.grade + size
      },
      {
        where: {
          uid
        }
      }
    )
    return '升级成功'
  },
  1: async (uid: string, size: number) => {
    const data = (await user_home.findOne({
      where: {
        uid
      },
      include: [
        {
          model: levels,
          where: {
            typing: 1
          }
        }
      ],
      raw: true
    })) as any
    const max = await Search(1).then(res => res[res.length - 1])
    if (data.grade >= max.grade) {
      return '已满级'
    }
    if (data.exp < data['level.exp_need']) {
      return `经验不足(${data.exp}/${data['level.exp_need']})`
    }
    /**
     * **********************
     */
    const uData = await user
      .findOne({
        where: {
          uid
        }
      })
      .then(data => data.dataValues)
    if (uData.species < data['level.species_need']) {
      return `金币不足(${uData.species}/${data['level.species_need']})`
    }
    await user.update(
      {
        species: uData.species - data['level.species_need']
      },
      {
        where: {
          uid
        }
      }
    )
    /**
     * **********************
     */
    await user_home.update(
      {
        exp: data.exp - data['level.exp_need'],
        grade: data.grade + size
      },
      {
        where: {
          uid
        }
      }
    )
    return '升级成功'
  },
  2: async (uid: string, size: number, id: number) => {
    const data = (await user_farmland.findOne({
      where: {
        uid,
        id: id
      },
      include: [
        {
          model: levels,
          where: {
            typing: 2
          }
        }
      ],
      raw: true
    })) as any
    if (!data) return '查无此田'
    const max = await Search(2).then(res => res[res.length - 1])
    if (data.grade >= max.grade) {
      return '已满级'
    }
    if (data.exp < data['level.exp_need']) {
      return `经验不足(${data.exp}/${data['level.exp_need']})`
    }
    /**
     * **********************
     */
    const uData = await user
      .findOne({
        where: {
          uid
        }
      })
      .then(data => data.dataValues)
    if (uData.species < data['level.species_need']) {
      return `金币不足(${uData.species}/${data['level.species_need']})`
    }
    await user.update(
      {
        species: uData.species - data['level.species_need']
      },
      {
        where: {
          uid
        }
      }
    )
    /**
     * **********************
     */
    await user_farmland.update(
      {
        exp: data.exp - data['level.exp_need'],
        grade: data.grade + size
      },
      {
        where: {
          uid
        }
      }
    )
    return '升级成功'
  },
  3: async (uid: string, size: number, id: number) => {
    const data = (await user_dog.findOne({
      where: {
        uid,
        id: id
      },
      include: [
        {
          model: levels,
          where: {
            typing: 3
          }
        }
      ],
      raw: true
    })) as any
    if (!data) return '查无此狗'
    const max = await Search(3).then(res => res[res.length - 1])
    if (data.grade >= max.grade) {
      return '已满级'
    }
    if (data.exp < data['level.exp_need']) {
      return `经验不足(${data.exp}/${data['level.exp_need']})`
    }

    /**
     * **********************
     */
    const uData = await user
      .findOne({
        where: {
          uid
        }
      })
      .then(data => data.dataValues)
    if (uData.species < data['level.species_need']) {
      return `金币不足(${uData.species}/${data['level.species_need']})`
    }
    await user.update(
      {
        species: uData.species - data['level.species_need']
      },
      {
        where: {
          uid
        }
      }
    )
    /**
     * **********************
     */

    await user_dog.update(
      {
        exp: data.exp - data['level.exp_need'],
        grade: data.grade + size
      },
      {
        where: {
          uid
        }
      }
    )
    return '升级成功'
  }
}

/**
 * 升级
 * @param typing 类型
 * @param size 默认一级
 */
export async function Up(
  uid: string,
  typing: number,
  size: number = 1,
  id: number
): Promise<string> {
  if (Object.prototype.hasOwnProperty.call(LevelsMap, typing)) {
    return await LevelsMap[typing](uid, size, id)
  }
  return '错误类型'
}

/**
 * 降级
 * @param typing 类型
 * @param size 默认一级
 */
export function Down(typing: number, size: number = -1) {
  if (typing == 0) {
    // 0家园
  } else if (typing == 1) {
    // 1背包
  } else if (typing == 2) {
    // 土壤
  }
}
