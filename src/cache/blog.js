/** 
 * 微博缓存
 */

const {
    get,
    set
} = require('./_redis');
const {
    getBlogListByUser
} = require('../services/blog');

//redis key 前缀
const KEY_PRIFIX = 'weibo:square:';

//获取广场列表缓存
async function getSquareCacheList(pageIndex, pageSize) {
    const key = `${KEY_PRIFIX}${pageIndex}_${pageSize}`

    // 尝试获取缓存
    const cacheResult = await get(key);
    if (cacheResult !== null) {
        return cacheResult;
    }

    //没有缓存，则读取数据库
    const result = await getBlogListByUser({
        pageIndex,
        pageSize
    })

    //设置和缓存，过期时间
    set(key, result, 60)
    return result;
}


module.exports = {
    getSquareCacheList
}