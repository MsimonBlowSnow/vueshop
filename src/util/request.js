import $http from 'axios'
import store from "../store"
//配置请求的根路径
$http.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
$http.interceptors.request.use(config=>{
    config.headers.Authorization = store.getters["loginModule/getToken"];
    return config;
})
export default $http;
