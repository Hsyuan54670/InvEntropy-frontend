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
import AdminProjectsApproval from '@/views/admin/AdminProjectsApproval.vue'
import AdminFundsApproval from '@/views/admin/AdminFundsApproval.vue'
import AdminManageProjects from '@/views/admin/AdminProjectsView.vue'
import AdminFundsLogs from '@/views/admin/AdminFundsLog.vue'
import AdminProjectsLogs from '@/views/admin/AdminProjectsLog.vue'

// JWT解码函数 - 根据后端JWT生成逻辑解析token
function parseJwt(token) {
  try {
    // 获取JWT的第二部分(payload)
    const base64Url = token.split('.')[1];
    // 将Base64Url转换为标准Base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // 解码Base64并转换为JSON对象
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/',redirect:"/login",},
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
            {path:'/projectsApproval', name:'ProjectsApproval', component:AdminProjectsApproval},
            {path:'/fundsApproval', name:'FundsApproval', component:AdminFundsApproval},
            {path:'/manageProjects', name:'ManageProjects', component:AdminManageProjects},
            {path:'/fundsLogs', name:'FundsLogs', component:AdminFundsLogs},
            {path:'/projectsLogs', name:'ProjectsLogs', component:AdminProjectsLogs}
        ]
    },
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 获取存储在localStorage中的用户信息
  const loginUser = localStorage.getItem('loginUser')
  
  // 需要管理员权限的路径
  const adminPaths = [
    '/admin',
    '/adminLayout',
    '/adminHome',
    '/projectsApproval',
    '/fundsApproval',
    '/manageProjects',
    '/fundsLogs',
    '/projectsLogs'
  ]
  
  // 检查目标路径是否需要管理员权限
  const requiresAdmin = adminPaths.some(path => to.path.startsWith(path))
  
  if (requiresAdmin) {
    // 如果访问的是管理员页面
    if (loginUser) {
      // 用户已登录，从token中解析用户类型
      try {
        const userData = JSON.parse(loginUser)
        const tokenPayload = parseJwt(userData.token)
        
        // 根据后端代码，userType存储在token的payload中
        if (tokenPayload && tokenPayload.userType === 'admin') {
          // 是管理员，允许访问
          next()
        } else {
          // 不是管理员，重定向到普通用户主页
          next('/layout')
        }
      } catch (e) {
        // 解析用户信息或token失败，重定向到登录页
        next('/login')
      }
    } else {
      // 用户未登录，重定向到登录页
      next('/login')
    }
  } else if (to.path === '/login' && loginUser) {
    // 已登录用户访问登录页时，根据用户类型重定向
    try {
      const userData = JSON.parse(loginUser)
      const tokenPayload = parseJwt(userData.token)
      
      // 根据后端代码，userType存储在token的payload中
      if (tokenPayload && tokenPayload.userType === 'admin') {
        next('/admin')
      } else {
        next('/layout')
      }
    } catch (e) {
      next()
    }
  } else {
    // 其他情况，正常放行
    next()
  }
})

export default router