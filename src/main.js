import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"
import "./plugins/elementui"
import axios from 'axios'

// import elementui from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';


//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.prototype.$http = axios;

// Vue.use(elementui);
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
