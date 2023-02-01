/* Dashboard板块的接口 */
import http from "./http";

// 获取信息
const queryData = (sentry_key, sentry_version) => {
    return http.post(`5737358/envelope/?sentry_key=${sentry_key}$sentry_version=${sentry_version}`)
}


/* 
添加商品模块接口
*/
const addGoods = (data) => {
    return http.post("/goods", data)
}
//获取商品分类
const queryGoodsClassify = (
    pageNumber = 1,
    pageSize = 1000,
    categoryLevel = 1,
    parentId = 0) => {
    return http.get('/categories', {
        params: {
            pageNumber,
            pageSize,
            categoryLevel,
            parentId
        }
    })
}
//修改商品
const upGoods = (data) => {
    return http.put('/goods', data)
}


export default {
    queryData,
    addGoods,
    queryGoodsClassify,
    upGoods,
}