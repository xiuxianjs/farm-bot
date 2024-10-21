import moment from 'moment'

/**
 * 进程沉睡
 * @param time
 * @returns
 */
export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

/**
 * 随机一个元素
 * @param ARR
 * @returns
 */
export function Anyarray(ARR: any[]) {
  const randindex = Math.trunc(Math.random() * ARR.length)
  return ARR[randindex]
}

/**
 * 强制修正至少为1
 * @param value
 * @returns
 */
export function leastOne(value: any) {
  let size = value
  if (isNaN(parseFloat(size)) && !isFinite(size)) {
    return Number(1)
  }
  size = Number(Math.trunc(size))
  if (size == null || size == undefined || size < 1 || isNaN(size)) {
    return Number(1)
  }
  return Number(size)
}

/**
 * 转化为对象
 * @param time
 * @returns
 */
export function timeInvert(time: number) {
  const date = new Date(time)
  return {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
}

/**
 * 转换为字符
 * @param timestamp
 * @returns
 */
export function timeChange(timestamp: string | number | Date) {
  const date = new Date(timestamp)
  const M =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  return `${date.getFullYear()}-${M}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

/**
 * 概率获取器
 * @param min
 * @param max
 * @param percent
 * @returns
 */
export function isTrueInRange(min = 1, max = 100, percent = 0) {
  if (percent <= 0) return false
  if (percent >= 100) return true
  // 概率 percent越大 p越大
  const p = (percent / 100) * (max - min + 1) + min
  // 随机数[1,100] 取一个
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  if (randomNum <= p) return true
  return false
}

/**
 * 时间格式化
 * @param time
 * @returns
 */
export function convertTime(time: number) {
  const ms = time % 1000
  time = (time - ms) / 1000
  const secs = time % 60
  time = (time - secs) / 60
  const mins = time % 60
  time = (time - mins) / 60
  const hrs = time % 24
  const days = (time - hrs) / 24
  return `${days}天${hrs}小时${mins}分${secs}秒`
}

/**
 * 未来时间
 * @param milliseconds
 * @returns
 */
export function formatFutureDate(milliseconds: number): string {
  const currentDate = new Date().getTime()
  const futureDate = new Date(currentDate + milliseconds)
  // 格式化日期
  return futureDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
}

/**
 * 计算时间戳差
 * @param time1 小时间
 * @param time2 大时间
 * @returns 天、小时、分钟、秒
 */
export function calculateTimeDifference(time1: number, time2: number) {
  const moment1 = moment(time1)
  const moment2 = moment(time2)
  const duration = moment.duration(moment2.diff(moment1))

  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  // 返回包含差值的对象
  return {
    days,
    hours,
    minutes,
    seconds
  }
}
