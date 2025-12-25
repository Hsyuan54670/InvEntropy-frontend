<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { changePasswordApi } from '@/api/teacher'

const router = useRouter()
const dialogVisible = ref(false)
const subForm = ref({
  id: '',
  password: '',
  confirmPassword: ''
})

// 退出登录
const logout = () => {
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
    router.push('/login')
  }).catch(() => {})
}

// 修改密码
const cpFormRef = ref()
const openChangePassword = () => {
  if (cpFormRef.value) {
    cpFormRef.value.resetFields()
  }
  subForm.value.password = ''
  subForm.value.confirmPassword = ''
  dialogVisible.value = true
}

const submitChangePassword = async () => {
  if (!cpFormRef.value) {
    ElMessage.error('请填写完整密码信息')
    return
  }
  cpFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整密码信息')
      return
    } else {
      const result = await changePasswordApi(subForm.value)
      if (result.code === 200) {
        ElMessage.success(result.msg)
        dialogVisible.value = false
      } else {
        ElMessage.error(result.msg)
      }
    }
  })
}

const rules = ref({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度应在6到32位之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== subForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
})
</script>

<template>
  <div class="common-layout">
    <!-- 头部 -->
    <el-container class="first-container">
      <el-header class="header">
        <div class="header-content">
          <span class="title">XX大学项目管理系统</span>
          <div class="right-tools">
            <el-dropdown>
              <span class="user-actions">
                <el-icon><User /></el-icon>
                <span class="user-name">用户</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openChangePassword">
                    <el-icon><EditPen /></el-icon>修改密码
                  </el-dropdown-item>
                  <el-dropdown-item @click="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
            background-color="#f8f9fa"
            text-color="#343a40"
            active-text-color="#409eff"
          >
            <el-menu-item index="/home">
              <el-icon><HomeFilled /></el-icon>
              <span>个人主页</span>
            </el-menu-item>
              
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>项目管理</span>
              </template>
                <el-menu-item index="/newProject">
                  <el-icon><Promotion /></el-icon>
                  <span>申报项目</span>
                </el-menu-item>
                <el-sub-menu index="1-4">
                <template #title>
                  <el-icon><UserFilled /></el-icon>
                  <span>我的项目</span>
                </template>
                <el-menu-item index="/ingProjects">
                  <el-icon><Tools /></el-icon>
                  <span>进行中的项目</span>
                </el-menu-item>
                <!-- 未通过包括被驳回和未处理的项目 -->
                <el-menu-item index="/unpassedProjects">
                  <el-icon><WarningFilled /></el-icon>
                  <span>未通过的项目</span>
                </el-menu-item>  
                <el-menu-item index="/finishedProjects">
                  <el-icon><SuccessFilled /></el-icon>
                  <span>已完成的项目</span>
                </el-menu-item>
              </el-sub-menu>
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

    <!-- 修改密码对话框 -->
    <el-dialog 
      title="修改密码" 
      v-model="dialogVisible" 
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="subForm" ref="cpFormRef" :rules="rules" label-width="120px">
        <el-form-item label="新密码" prop="password">
          <el-input 
            v-model="subForm.password" 
            placeholder="请输入新密码" 
            clearable 
            style="width: 100%;" 
            type="password" 
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="subForm.confirmPassword" 
            placeholder="请确认新密码" 
            clearable 
            style="width: 100%;" 
            type="password" 
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitChangePassword">确定</el-button>
      </template>
    </el-dialog>
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

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  color: #495057;
}

.user-actions:hover {
  background-color: #f8f9fa;
  color: #409eff;
}

.user-name {
  font-size: 14px;
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
  background-color: #eaf2ff;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #f5f9ff;
}
</style>
