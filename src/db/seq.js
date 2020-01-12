/**
 * @description sequelize 实例
 * @author money
 */
const Sequelize = require('sequelize')
const {MYSQL_CONF} = require('../config/db')
const  { isPro,isTest}  = require('../utils/env')

let conf={
    host:'localhost',
    dialect:'mysql'
}
if(isPro){
    conf.pool = {
        max:5,
        min:0,
        idle:10000 //一个链接池10s之内没有链接就会被释放
    }
}
if(isTest){
    conf.logging=()=>{
    }
}
const {database,user,password } = MYSQL_CONF

const seq  = new Sequelize(database,user,password,conf)

module.exports = seq