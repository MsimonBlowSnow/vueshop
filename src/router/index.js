import Vuerouter from 'vue-router';
import Vue from "vue"
import store from "../store"
Vue.use(Vuerouter)
const router = new Vuerouter({
    routes:[{
        path: "/",
        redirect: "/login",
    },{
        path:"/login",
        name:"login",
        component: ()=>import("@/views/Login"),
    },{
        path:"/home",
        name:"home",
        component: ()=>import("@/views/Home"),
    }]
});

router.beforeEach ((to,from,next)=>{
    if(to.name !== "login" && !store.state.loginModule.token){
        console.log(1);
        next({name:"login"});
        return
    }
    return next();
})
export default router;