import http from "./http"

//获取当前登录者信息
const queryData = () => {
    return http.get('/adminUser/profile')
}

//修改登录名和昵称
const updateName = (loginUserNmae, nickName) => {
    return http.put('/adminUser/name', {
        loginUserNmae,
        nickName
    })
}

const updataPassword = (newPassword, originalPassword) => {
    return http.put('/adminUser/password', {
        newPassword,
        originalPassword
    })
}

export default {
    queryData,
    updateName,
    updataPassword
}