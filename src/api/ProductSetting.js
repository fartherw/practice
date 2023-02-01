// 新品上线设置的接口
import http from "./http";

//获取新品上线列表信息
const queryProductList = (pageNumber = 1, pageSize = 10, configType = 4) => {
    return http.get('/indexConfigs', {
        params: {
            pageNumber,
            pageSize,
            configType
        }
    })
}
// 获取详细信息---新品上线
const info = (id) => {
    return http.get(`/indexConfigs/${id}`)
}

//删除---新品上线
const removeProduct = (ids) => {
    return http.delete('/indexConfigs', {
        data: {
            ids
        }
    })
}

//修改---新品上线
const updataProduct = (data) => {
    return http.put('/indexConfigs', data)
}

//添加---新品上线
const addProduct = (data) => {
    return http.post('/indexConfigs', data)
}



/* 为你推荐 */

//获取为你推荐列表信息
const queryRecommendList = (pageNumber = 1, pageSize = 10, configType = 5) => {
    return http.get('/indexConfigs', {
        params: {
            pageNumber,
            pageSize,
            configType
        }
    })
}
// 获取详细信息---为你推荐
const infoRecommend = (id) => {
    return http.get(`/indexConfigs/${id}`)
}

//删除---为你推荐
const removeRecommend = (ids) => {
    return http.delete('/indexConfigs', {
        data: {
            ids
        }
    })
}

//修改---为你推荐
const updataRecommend = (data) => {
    return http.put('/indexConfigs', data)
}

//添加---为你推荐
const addRecommend = (data) => {
    return http.post('/indexConfigs', data)
}


export default {
    queryProductList,
    queryRecommendList,
    removeProduct,
    info,
    updataProduct,
    addProduct,
    infoRecommend,
    removeRecommend,
    updataRecommend,
    addRecommend
}