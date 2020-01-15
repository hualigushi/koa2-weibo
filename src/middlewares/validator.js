/**
 * @description json schema 数据校验中间件
 * @author money
 */
const {ErrorModel} = require('../model/resModel')
const {jsonSchemaFileInfo} =require('../model/errorInfo')
/**
  * 
  * @param {function} validateFunction 验证函数
  */
function genValidator(validateFn){
    async function validate(ctx,next){

        const error =  validateFn(ctx.request.body)

        if(error){
            ctx.body= new ErrorModel(jsonSchemaFileInfo)
            return 
        }
        
        await next()
    }
    return validate
}

module.exports = {
    genValidator
}
