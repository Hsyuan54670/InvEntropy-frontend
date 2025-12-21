<script setup>
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessageBox,ElMessage} from 'element-plus'
const router = useRouter()
const user=ref('')

onMounted(()=>{
})

// 退出登录
const logout=()=>{
  // 确认退出登录
  ElMessageBox.confirm(
    '确定退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    localStorage.removeItem('loginUser')
    user.value=''
    router.push('/login')
  }).catch(() => {
    
  })
}

</script>

<template>
  <div class="common-layout">
    <!-- 头部 -->
    <el-container class="first-container">
      <el-header class="header">
        <span class="title">XX大学项目管理系统</span>
        <span class="right-tools">
          <a href="javascript:void(0)" @click="logout">
            <el-icon><SwitchButton /></el-icon>退出登录
          </a>
        </span>
      </el-header>

      <el-container class="second-container">
      <!-- 侧边栏 -->
        <el-aside width="300px" class="aside">
          <el-menu router="true">

          <el-menu-item index="/AdminHome">
            <template #title>
              <el-icon><HomeFilled /></el-icon>概览
            </template>
          </el-menu-item>
            
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Opportunity /></el-icon>工作
            </template>
              <el-menu-item index="/projectsApproval"><el-icon><List /></el-icon>申批项目</el-menu-item>
              <el-menu-item index="/fundsApproval"><el-icon><Coin /></el-icon>审批经费</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Menu /></el-icon>管理
            </template> 
                <el-menu-item index="/manageProjects"><el-icon><Checked /></el-icon>查看所有项目</el-menu-item>
                <el-menu-item index="/fundsLogs"><el-icon><TrendCharts /></el-icon>资金流水记录</el-menu-item>
                <el-menu-item index="/projectsLogs"><el-icon><Management /></el-icon>项目管理记录</el-menu-item>
          </el-sub-menu>

        </el-menu>
        </el-aside>
      <!-- 主体 -->
        <el-main>
          <!-- 路由出口，页面内容将在这里渲染 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    

  </div>

</template>

<style scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  background: linear-gradient(to right, #5baef6, #a4e1f8);
}
.title {
  font-size: 40px;
  font-weight: bold;
  color: white;
  font-family: '楷体';
}
.right-tools {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-family: '楷体';
}
.right-tools a{
  display: inline-flex;
  gap:3px;
  color: white;
  text-decoration: none;
}
.right-tools a:hover {
  color: #f0f0f0; 
}
.second-container .aside {
  border-right: 2px solid #e0e0e0;
  background-color: #f8f9fa;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
