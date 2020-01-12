/**
 * @description json schema 数据校验中间件
 * @author money
 */
const {ErrorModel} = require('../model/resModel')
const {jsonScrema} =require('../model/errorInfo')
/**
  * 
  * @param {function} validateFunction 验证函数
  */
function genValidate(validateFunction){
    async function validate(ctx,next){

        const error =  validateFunction(ctx.request.body)

        if(error){
            ctx.body= new ErrorModel(jsonScrema)
            return 
        }
        
        await next()
    }
    return validate
}

module.exports = {
    genValidate
}