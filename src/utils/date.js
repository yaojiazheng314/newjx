export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * @description 比较日期大小
 * @param {String} datestr1
 * @param {String} datestr2
 * @return {Boolean} datestr1 > datestr2
 */
export function dateoneBigger(datestr1, datestr2) {
  const date1 = Date.parse(datestr1)
  const date2 = Date.parse(datestr2)
  return date1 > date2
}

/**
 * @description 比较两个日期相差多少月
 * @param {String} datestr1: yyyy-MM
 * @param {String} datestr2: yyyy-MM
 * @return {Int} datestr1与datestr2相差月数
 */
export function monthsDiffer(datestr1, datestr2) {
  const date1 = datestr1.split('-')
  const date2 = datestr2.split('-')
  var year1 = date1[0]
  var month1 = date1[1]
  var year2 = date2[0]
  var month2 = date2[1]
  const months = (year2 - year1) * 12 + (month2 - month1) + 1
  return months
}

/**
 * @param {String} datestr1
 * @param {String} datestr2
 * @return {Number, Int} days
 */
export function daysDiffer(datestr1, datestr2) {
  const date1 = Date.parse(datestr1)
  const date2 = Date.parse(datestr2)
  let datespan = date1-date2
  // datespan = Math.abs(datespan)
  var days = Math.floor(datespan / (24 * 3600 * 1000))
  return days
}

/**
 * @param {Number} daysDiffer:相差天数
 * @param {String} datestr: yyyy-MM-dd
 * @param {String} timestr: hh:mm
 */
export function timeFromNow(daysDiffer, datestr, timestr) {
  switch(daysDiffer) {
    case -2:
      return `前天 ${timestr}`;
    case -1:
      return `昨天 ${timestr}`;
    case 0:
      return `今天 ${timestr}`;
    case 1:
      return `明天 ${timestr}`;
    case 2:
      return `后天 ${timestr}`;
    default:
      return`${datestr} ${timestr}`;
  }
}

/**
 * @param {String} ymStr
 * @param {String} flag: 'range': 匹配yyyy-MM
 * @return ymStr是否匹配"yyyy-MM"或"yyyy-MM,yyyy-MM"格式
 */
export function formateYmStr(ymStr, flag) {
  if (flag === 'range') {
    let regYmRange = new RegExp(/^\d{4}-((0([1-9]))|(1(0|1|2))),\d{4}-((0([1-9]))|(1(0|1|2)))$/)
    return regYmRange.test(ymStr)
  }
  let regYm = new RegExp(/^\d{4}-((0([1-9]))|(1(0|1|2)))$/)
  return regYm.test(ymStr)
}

/**
 * @param {Boolean} isNow: 获取当前年月
 * @param {Number} months 相差月数
 * @return {String} 获取年月，格式："yyyy-MM"
 */
export function getMonth(isNow, months) {
  if (isNow) {
    return fmtDate(new Date(), 'yyyy-MM')
  } else {
    const month = new Date().getMonth() + months
    const yearmonth = new Date(new Date().setMonth(month, 1))
    return fmtDate(yearmonth, 'yyyy-MM')
  }
}

function fmtDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

/**
 * @param howmany {Number}: 正整数 几小时后
 * @return 几小时后的Date
 */
export function getNextFewHours(howmany) {
  let timestamp = new Date().getTime()
  timestamp += howmany * 60 * 60 * 1000
  return new Date(timestamp)
}

/**
 * @param {Date} date
 * @return {String} 星期几
 */
export function getDayOfWeek(date) {
  const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"]
  let daysIndex = date.getDay()
  return `星期${daysOfWeek[daysIndex]}`
}