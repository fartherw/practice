import axios from "axios";
import { Message } from 'element-ui';
import _ from "@/assets/utils";

const http = axios.create({
    baseURL: '/api',
    timeout: 60000
});
http.interceptors.request.use(config => {
    //除了/adminUser/login，其余的向服务器发送请求都需要携带token
    let token = _.storage.get('tk');

    if (token && config.url !== '/adminUser/login') {
        config.headers['token'] = token;
    }
    return config;
});
http.interceptors.response.use(response => {
    return response.data;
}, reason => {
    Message.error('当前网络繁忙，请您稍后再试~');
    return Promise.reject(reason);
});
export default http;