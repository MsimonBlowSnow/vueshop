import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"
import "./plugins/elementui"
import"./plugins/quillEditor"
import TreeTable from 'vue-table-with-tree-grid'
import axios from "./util/request"
// import elementui from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
console.log(router)

Vue.prototype.$http = axios;
Vue.component('tree-table',TreeTable);
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth()+1 + '').padStart(2,'0');
  const d = (dt.getDate()+'').padStart(2,'0');
  const hh = (dt.getHours()+'').padStart(2,'0');
  const mm = (dt.getMinutes()+'').padStart(2,'0');
  const ss = (dt.getSeconds()+'').padStart(2,'0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

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
