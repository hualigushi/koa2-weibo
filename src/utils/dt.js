/**
 * @description 时间格式处理
 * @author chengpeng
 */

const {
    format
} = require('date-fns')

/**
 * @description 时间格式化
 * @author chengpeng
 * @param {string} str 时间字符串 
 */
function timeFormat(str) {
    return format(new Date(str), 'MM.dd HH.mm')
}

module.exports = {
    timeFormat
}
