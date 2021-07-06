import Vue from 'vue'
import Router from 'vue-router'
// 管理界面
import ManagerFrame from '@/layouts/manager';

Vue.use(Router);

let router = new Router({
    routes: [
        { //设置默认指向的路径
            path:'/',
            redirect: '/login'
        },{ // 404重定向
            path: "*",
            redirect: "/login"
        },{ // 登录界面
            path:'/login',
            name:'login',
            component: resolve => require(['@/pages/base/login'], resolve)
        },{ // 管理页面
            path:'/managerFrame',
            name:'managerFrame',
            component:ManagerFrame
        }
    ]
});

export default router;