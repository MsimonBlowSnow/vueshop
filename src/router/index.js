import Vue from "vue"
import VueRouter from 'vue-router';
import store from "../store"
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[{
        path: "/",
        redirect: "/login",
    },{
        path:"/login",
        name:"login",
        component: ()=>import(/* webpackChunkName:"login_home_welcome" */ "@/views/Login"),
    },{
        path:"/home",
        name:"home",
        component: ()=>import(/* webpackChunkName:"login_home_welcome" */ "@/views/Home"),
        redirect: "/welcome",
        children:[{
            path: "/welcome",
            component: ()=>import(/* webpackChunkName:"login_home_welcome" */ "@/components/Welcome")
        },{
            path: "/users",
            component: ()=>import(/* webpackChunkName:"Users_Rights_Roles" */'@/components/users/Users.vue'),
        },{
            path: "/rights",
            component: ()=>import( /* webpackChunkName:"Users_Rights_Roles" */ '@/components/power/Rights'),
        },{
            path : "/roles",
            component: ()=>import( /* webpackChunkName:"Users_Rights_Roles" */ '@/components/power/Roles'),
        },{
            path:"/categories",
            component: ()=>import(/* webpackChunkName: "Cate_Params" */ '@/components/good/Cate'),
        },{
            path: "/params",
            component: ()=>import(/* webpackChunkName: "Cate_Params" */ "@/components/good/Params"),
        },{
            path: "/goods",
            component: ()=>import( /* webpackChunkName: "GoodsList_Add" */ '@/components/good/List')
        },{
            path: "/goods/add",
            component: ()=>import(/* webpackChunkName: "GoodsList_Add" */ '@/components/good/Add')
        },{
            path: "/orders",
            component: ()=>import(/* webpackChunkName: "Order_Report" */'@/components/order/Order')
        },{
            path: "/reports",
            component: ()=>import( /* webpackChunkName: "Order_Report" */'@/components/report/Report')
        }]
    }]
});

router.beforeEach ((to,from,next)=>{
    if(to.name !== "login" && !store.state.loginModule.token){
        console.log(this);
        next({name:"login"});
        return
    }
    return next();
})
export default router;