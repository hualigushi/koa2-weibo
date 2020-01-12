/** 
 * 用户关注关系
 */

const seq = require('../seq')
const {
    INTEGER,
} = require('../types')

const UserRelation = seq.define('userRelation', {
    userId: {
        type: INTEGER,
        allowNumm: false,
        comment: '用户id'
    },
    followerId: {
        type: INTEGER,
        allowNumm: false,
        comment: '被关注用户的 id'
    }

})

module.exports = UserRelation