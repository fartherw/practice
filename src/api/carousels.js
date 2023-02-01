/* 轮播图设置板块的接口 */
import http from "./http";

//获取轮播图列表信息
const queryList = (pageNumber = 1, pageSize = 10) => {
    return http.get('/carousels', {
        params: {
            pageNumber,
            pageSize
        }
    });
};

//获取详细信息
const queryInfo = (carouselId) => {
    http.get(`/carousels/${carouselId}`)
};

//新增轮播图信息
const insert = (data) => {
    return http.post('/carousels', data)
}

//修改轮播图信息
const update = (data) => {
    http.put('/carousels', data)
}


//删除轮播图信息  [ids:要删除项的 carouselId 集合]
const remove = (ids) => {
    return http.delete('/carousels', {
        data: {
            ids
        }
    })
}


export default {
    queryList,
    queryInfo,
    insert,
    update,
    remove
}