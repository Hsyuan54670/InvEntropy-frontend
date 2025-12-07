<script setup>
</script>

<template>
  <div class="common-layout">
    <!-- 头部 -->
    <el-container class="first-container">
      <el-header class="header">
        <span class="title">XX大学项目管理系统</span>
        <span class="right-tools">
          <a href="javascript:void(0)" @click="openChangePassword">
            <el-icon><EditPen /></el-icon>修改密码 &nbsp;&nbsp;|&nbsp;&nbsp;
          </a>
          <a href="javascript:void(0)" @click="logout">
            <el-icon><SwitchButton /></el-icon>退出登录
          </a>
        </span>
      </el-header>

      <el-container class="second-container">
      <!-- 侧边栏 -->
        <el-aside width="300px" class="aside">
          <el-menu router="true">

          <el-menu-item index="/home">
            <template #title>
              <el-icon><HomeFilled /></el-icon>个人主页
            </template>
          </el-menu-item>
            
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Menu /></el-icon>项目管理
            </template>
              <el-menu-item index="/newProject"><el-icon><Promotion /></el-icon>申报项目</el-menu-item>
              <el-sub-menu index="1-4">
              <template #title><el-icon><UserFilled /></el-icon>我的项目</template>
              <el-menu-item index="/ingProjects"><el-icon><Tools /></el-icon>进行中的项目</el-menu-item>
              <!-- 未通过包括被驳回和未处理的项目 -->
              <el-menu-item index="/unpassedProjects"><el-icon><WarningFilled /></el-icon>未通过的项目</el-menu-item>  
              <el-menu-item index="/finishedProjects"><el-icon><SuccessFilled /></el-icon>已完成的项目</el-menu-item>
            </el-sub-menu>
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
