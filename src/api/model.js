import http from "./http";

/* 
分类管理模块相关接口
*/
//获取分类列表信息
const queryList = (pageNumber = 1, pageSize = 10, categoryLevel = 1, parentId = 0) => {
    return http.get('/categories', {
        params: {
            pageNumber,
            pageSize,
            categoryLevel,
            parentId
        }
    })
}

//删除分类信息
const removeClassify = (ids) => {
    return http.delete('/categories', {
        data: {
            ids
        }
    })
}

//获取分类详细信息
const classifyInfo = (ids) => {
    return http.get(`/categories/${ids}`)
}

//修改分类信息
const updataClassify = (data) => {
    return http.put('/categories', data)
}

//增加分类信息
const addClassify = (data) => {
    return http.post('/categories', data)
}


/* 商品管理模块接口 */
//获取商品列表信息
const queryGoodsList = (pageNumber = 1, pageSize = 10) => {
    return http.get('/goods/list', {
        params: {
            pageNumber,
            pageSize
        }
    })
}
//获取商品详细信息
const queryGoodsInfo = (ids) => {
    return http.get(`/goods/${ids}`)
}
//商品上下架
const upDown = (status, ids) => {
    return http.put(`/goods/status/${status}`, {
        ids
    })
}

/* 会员管理模块接口 */
//会员列表信息
const queryVipList = (pageNumber = 1, pageSize = 10) => {
    return http.get('/users', {
        params: {
            pageNumber,
            pageSize
        }
    })
}
//禁用/解除 账户
const disableAccount = (status, ids) => {
    return http.put(`/users/${status}`, {
        ids
    })
}

/* 订单管理模块接口 */
//订单列表信息
const queryOrderList = (pageNumber = 1, pageSize = 10, orderNo, orderStatus) => {
    return http.get('/orders', {
        params: {
            pageNumber,
            pageSize,
            orderNo,
            orderStatus
        }
    })
}
//关闭订单
const colseOrder = (ids) => {
    return http.put('/orders/close', {
        ids
    })
}
//配货完成
const OrderSuccess = (ids) => {
    return http.put('/orders/checkDone', {
        ids
    })
}
//出库
const checkOut = (ids) => {
    return http.put('/orders/checkOut', {
        ids
    })
}
//订单详情
const orderInfo = (id) => {
    return http.get(`/orders/${id}`)
}

export default {
    //分类管理模块
    queryList,
    removeClassify,
    classifyInfo,
    updataClassify,
    addClassify,
    //商品管理模块
    queryGoodsList,
    queryGoodsInfo,
    upDown,
    //会员管理模块
    queryVipList,
    disableAccount,
    //订单管理模块
    queryOrderList,
    colseOrder,
    OrderSuccess,
    checkOut,
    orderInfo,
}