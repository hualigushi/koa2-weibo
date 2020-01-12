/** 
 * utils controller
 */

const path = require('path')
const fse = require('fs-extra')
const {
    ErrorModel,
    SuccessModel
} = require('../model/ResModel');
const {
    uploadFileSizeFailInfo
} = require('../model/ErrorInfo')


//存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')

const MIX_SIZE = 1024 * 1024 * 1024 //文件最大体积 1M

//是否需要创建目录
fse.pathExists(DIST_FOLDER_PATH).then(exist => {
    if (!exist) {
        fse.ensureDir(DIST_FOLDER_PATH)
    }
})

//文件上传  
async function saveFile({
    name,
    type,
    size,
    filePath
}) {
    if (size > MIX_SIZE) {
        await fse.remove(filePath)
        return new ErrorModel(uploadFileSizeFailInfo)
    }

    //移动文件
    const fileName = Date.now() + '.' + name; //防止重名
    const distFilePath = path.join(DIST_FOLDER_PATH, fileName) //目的地
    await fse.move(filePath, distFilePath)

    //返回信息   
    return new SuccessModel({
        url: fileName,
    })


}

module.exports = {
    saveFile
}