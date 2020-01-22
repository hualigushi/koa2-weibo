/**
 * @description 时间格式处理
 * @author money
 */

const {
    format
} = require('date-fns')

/**
 * @description 时间格式化
 * @author money
 * @param {string} str 时间字符串 
 */
function timeFormat(str) {
    return format(new Date(str), 'MM.dd HH:mm')
}

module.exports = {
    timeFormat
}
