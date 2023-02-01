/* 热销商品设置板块的接口 */
import http from "./http";

//获取热销商品信息
const queryList = (pageNumber = 1, pageSize = 0, configType = 3) => {
    return http.get('/indexConfigs', {
        params: {
            pageNumber,
            pageSize,
            configType
        }
    })
}

// 获取热销商品详细信息
const info = (id) => {
    return http.get(`/indexConfigs/${id}`)
}

//添加热销商品信息
const addGood = (data) => {
    return http.post('/indexConfigs', data)
}


//删除热销商品信息
const removeGood = (ids) => {
    return http.delete('/indexConfigs', {
        data: {
            ids
        }
    })
}

//修改热销商品信息
const updataGood = (data) => {
    return http.put('/indexConfigs', data)
}

export default {
    queryList,
    addGood,
    removeGood,
    updataGood,
    info
}