import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"
import "./plugins/elementui"
import TreeTable from 'vue-table-with-tree-grid'
import axios from "./util/request"
// import elementui from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$http = axios;
Vue.component('tree-table',TreeTable);


if(localStorage.getItem("vueTestToken") && localStorage.getItem("vueTestUser")){
  store.commit("loginModule/setUser",JSON.parse(localStorage.getItem("vueTestUser")));
  store.commit("loginModule/setToken",localStorage.getItem("vueTestToken"));
}
// Vue.use(elementui);
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
