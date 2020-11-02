import $http from 'axios'
import store from "../store"

import nprogress from 'nprogress'
//配置请求的根路径
$http.defaults.baseURL = "http://81.68.243.248:8888/api/private/v1/";
$http.interceptors.request.use(config=>{
    nprogress.start();
    config.headers.Authorization = store.getters["loginModule/getToken"];
    return config;
})

$http.interceptors.response.use(config=>{
    nprogress.done()
    return config;
})
export default $http;
