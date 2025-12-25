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
        <div class="header-content">
          <span class="title">XX大学项目管理系统 - 管理员</span>
          <div class="right-tools">
            <el-button 
              type="danger" 
              :icon="SwitchButton" 
              @click="logout"
            >
              管理员退出
            </el-button>
          </div>
        </div>
      </el-header>

      <el-container class="second-container">
      <!-- 侧边栏 -->
        <el-aside width="250px" class="aside">
          <el-menu 
            router="true" 
            class="side-menu"
            :default-active="$route.path"
            :collapse="false"
            background-color="#f8f9fa"
            text-color="#343a40"
            active-text-color="#d9534f"
          >
            <el-menu-item index="/AdminHome">
              <el-icon><HomeFilled /></el-icon>
              <span>概览</span>
            </el-menu-item>
              
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Opportunity /></el-icon>
                <span>工作</span>
              </template>
                <el-menu-item index="/projectsApproval">
                  <el-icon><List /></el-icon>
                  <span>审批项目</span>
                </el-menu-item>
                <el-menu-item index="/fundsApproval">
                  <el-icon><Coin /></el-icon>
                  <span>审批经费</span>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>管理</span>
              </template> 
                <el-menu-item index="/manageProjects">
                  <el-icon><Checked /></el-icon>
                  <span>查看所有项目</span>
                </el-menu-item>
                <el-menu-item index="/fundsLogs">
                  <el-icon><TrendCharts /></el-icon>
                  <span>资金流水记录</span>
                </el-menu-item>
                <el-menu-item index="/projectsLogs">
                  <el-icon><Management /></el-icon>
                  <span>项目管理记录</span>
                </el-menu-item>
                <el-menu-item index="/account">
                  <el-icon><Management /></el-icon>
                  <span>账号管理</span>
                </el-menu-item>
            </el-sub-menu>

          </el-menu>
        </el-aside>
      <!-- 主体 -->
        <el-main class="main-content">
          <!-- 路由出口，页面内容将在这里渲染 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
  overflow: hidden;
}

.first-container {
  height: 100vh;
}

.header {
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #eee;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #fff;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}

.right-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.second-container .aside {
  border-right: 1px solid #e9ecef;
  background-color: #f8f9fa;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.side-menu {
  border-right: none;
  height: calc(100vh - 60px);
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item:hover) {
  background-color: #ffebee;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #ffebee;
}

:deep(.el-menu-item.is-active) {
  background-color: #fadfdd;
  color: #d9534f;
}
</style>
