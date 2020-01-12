/** 
 * 用户数据模型
 */

const seq = require('../seq');
const {
    STRING,
    DECIMAL
} = require('../types')

//users
const User = seq.define('user', {
    userName: {
        type: STRING,
        allowNull: false, //不能为空
        unique: true, //唯一性
        comment: '用户名，唯一的'
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: '密码'
    },
    nickName: {
        type: STRING,
        allowNull: false, //不能为空
        comment: '昵称'
    },
    gender: {
        type: DECIMAL,
        allowNull: false,
        defaultValue: 3, //默认值
        comment: '性别: (1男性，2女性，3保密)'

    },
    picture: {
        type: STRING,
        commnet: '头像，图片地址'
    },
    city: {
        type: STRING,
        comment: '城市'
    }
})

module.exports = User