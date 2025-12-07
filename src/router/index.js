import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import Home from '@/views/Home.vue'
import NewProject from '@/views/NewProject.vue'
import IngProjects from '@/views/IngView.vue'
import UnpassedProjects from '@/views/UpassedView.vue'
import FinishedProjects from '@/views/FinishedView.vue'


import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminHome from '@/views/admin/AdminHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/',redirect:"/layout",},
    {path:'/login',name:'Login',component:Login},
    {
        path: '/layout',
        name:'Layout',
        component:Layout,
        redirect:"/home",
        children:[
            {path:'/home',name:'Home',component:Home},
            {path:'/ingProjects',name:'IngProjects',component:IngProjects},
            {path:'/unpassedProjects',name:'UnpassedProjects',component:UnpassedProjects},
            {path:'/finishedProjects',name:'FinishedProjects',component:FinishedProjects},
            {path:'/newProject',name:'NewProject',component:NewProject},
        ]
    },


    
    {
        path: '/admin',
        redirect:"/adminLayout",
    },
    {
        path: '/adminLayout',
        name:'AdminLayout',
        component:AdminLayout,
        redirect:"/adminHome",
        children:[
            {path:'/adminHome',name:'AdminHome',component:AdminHome},
        ]
    },
  ],
})

export default router
