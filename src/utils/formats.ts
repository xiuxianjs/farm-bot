import moment from 'moment'
import Decimal from 'decimal.js'

/**
 * 格式化时间&数字
 */
export class Formats {
  /**
   * 时间格式化
   * @static
   * @param {Date|string} value
   * @param {string} formatter YYYY-MM-DD hh:mm:ss
   * @returns {string}
   * @memberof Formats
   */
  static date(value: Date | string, formatter: string = 'YYYY-MM-DD'): string {
    const date: moment.Moment = moment(value)
    if (date.isValid()) return date.format(formatter)
    return ''
  }

  /**
   * 判断两个时间是否同一天
   * @param {Date|string}  day1
   * @param {Date|string} day2
   * @returns {Boolean}
   * @memberof Formats
   */
  static isSameDay(day1: string | Date, day2: Date | string): boolean {
    return new Date(day1).toDateString() === new Date(day2).toDateString()
  }

  // 处理两个时间的时间差
  static diffTime(day1: string | Date, day2: Date | string): boolean | string {
    const start = new Date(day1).valueOf()
    const end = new Date(day2).valueOf()

    // 计算两个时间差的毫秒数并转为秒
    const diffInMilliseconds = Math.round((end - start) / 1000)
    if (diffInMilliseconds <= 0) return false

    return Formats.formatTime(diffInMilliseconds)
  }

  // 将时间数变成小时分钟
  static formatTime(value: number | string): string {
    value = Number(value || 0)
    // 将秒数转换为小时
    const hours = Math.floor(value / 3600)
    // 将秒数转换为分钟和秒
    const minutes = Math.floor(value / 60)

    if (hours || minutes)
      return hours ? hours + '小时' : '' + minutes ? minutes + '分钟' : ''
    else {
      const seconds = value % 60
      return seconds ? seconds + '秒' : ''
    }
  }

  /**
   * 万元格式化
   * @param {number} value
   * @param {string} suffix 千|万|十万|百万
   * @returns {string} 10000 => 1万
   * @memberof Formats
   */
  static tenThousand(value: number, suffix: string = '万'): string {
    if (!value) return '0'
    const suffixType = {
      千: 1000,
      万: 10000,
      十万: 100000,
      百万: 1000000,
      千万: 10000000,
      亿: 100000000
    }

    return (
      new Decimal(value).div(suffixType[suffix]).toString() +
      (suffix && ` ${suffix}`)
    )
  }

  /**
   * 数字转化为千分位 （可带小数点）
   * @static
   * @param {number} value 数字
   * @param {number} [float=2] 小数位数
   * @return {string} 1000 => 1,000
   * @memberof Formats
   */
  static formatThousand(value: number, float: number = 2): string {
    if (!value) return '0'
    value = parseFloat(value.toFixed(float))
    return value.toString().replace(/\d+/, num => {
      return num.replace(/(\d)(?=(\d{3})+$)/g, $1 => {
        return $1 + ','
      })
    })
  }

  /**
   * 百分比处理
   * @static
   * @param {number} value 数字
   * @param {number} [float=2] 小数位数
   * @return {string}
   * @memberof Formats
   */
  static formatFloat(value: number, float: number = 2): string {
    if (!value) return '0%'
    value = parseFloat((value * 100).toFixed(float))
    return value + '%'
  }

  /**
   * 生成邀请码
   * @param {number} codeLength 邀请码长度
   * @returns {string}
   */
  static generateInviteCode(codeLength: number = 6): string {
    let code: string = ''
    const characters: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' // 邀请码包含的字符

    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length)) // 从字符集中随机选取一个字符
    }

    return code
  }

  /**
   * 数组分组
   * @param {object[]} arr
   * @param {string|function|callback} generateKey
   * @returns
   */
  static groupBy(
    arr: object[],
    generateKey: string | Function | ((item: object) => string)
  ): object {
    if (typeof generateKey === 'string') {
      generateKey = item => item[generateKey as string]
    }

    let result = {}
    for (const item of arr) {
      const key = generateKey(item)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
    }

    return result
  }

  /**
   * 计算时间戳差并返回各种单位的差值 -> 前为正数，后为负数
   * 例如传入时间2022年，再传入2023年，返回years=1，反之-1
   * @param {number} time 需要做比较的时间戳
   * @param {number} time2 基于一个时间点，默认当前时间
   */
  static formatBbsTime(time: number, time2: number = new Date().getTime()) {
    const milliseconds = Math.abs(time2 - time)
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)
    if (time2 < time) {
      return {
        milliseconds: milliseconds * -1,
        seconds: seconds * -1,
        minutes: minutes * -1,
        hours: hours * -1,
        days: days * -1,
        months: months * -1,
        years: years * -1
      }
    }
    return { milliseconds, seconds, minutes, hours, days, months, years }
  }
}
