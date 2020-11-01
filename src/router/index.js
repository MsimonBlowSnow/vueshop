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
        redirect: "/welcome",
        children:[{
            path: "/welcome",
            component: ()=>import("@/components/Welcome")
        },{
            path: "/users",
            component: ()=>import('@/components/users/Users.vue'),
        },{
            path: "/rights",
            component: ()=>import('@/components/power/Rights'),
        },{
            path : "/roles",
            component: ()=>import('@/components/power/Roles'),
        },{
            path:"/categories",
            component: ()=>import('@/components/good/Cate'),
        },{
            path: "/params",
            component: ()=>import("@/components/good/Params"),
        },{
            path: "/goods",
            component: ()=>import('@/components/good/List')
        },{
            path: "/goods/add",
            component: ()=>import('@/components/good/Add')
        },{
            path: "/orders",
            component: ()=>import('@/components/order/Order')
        },{
            path: "/reports",
            component: ()=>import('@/components/report/Report')
        }]
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