<script setup>
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessageBox,ElMessage} from 'element-plus'
import { changePasswordApi } from '@/api/teacher'
const router = useRouter()
const user=ref('')
const dialogVisible=ref(false)
const subForm=ref({
  id:'',
  password:'',
  confirmPassword:''
})

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
// 修改密码
const cpFormRef=ref()
const openChangePassword=()=>{
  if(cpFormRef.value){
    cpFormRef.value.resetFields()
  }
  subForm.value.password=''
  subForm.value.confirmPassword=''
  dialogVisible.value=true
}
const submitChangePassword=async()=>{
  if(!cpFormRef.value){
    ElMessage.error('请填写完整密码信息')
    return
  }
  cpFormRef.value.validate(async(valid)=>{
    if(!valid){
      ElMessage.error('请填写完整密码信息')
      return
    }else{
      const result=await changePasswordApi(subForm.value)
      if(result.code==200){
        ElMessage.success(result.msg)
        dialogVisible.value=false
      }else{
        ElMessage.error(result.msg)
      }
    }
  })
}
const rules=ref({
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
        <span class="title">XX大学项目管理系统</span>
        <span class="right-tools">
          <a href="javascript:void(0)" @click="openChangePassword">
            <el-icon><EditPen /></el-icon>修改密码
            
          </a>
          <span class="separator">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
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

    <div class="change-password-dialog">
    <el-dialog title="修改密码" 
     v-model="dialogVisible" 
      width="400px"
    >
      <el-form :model="subForm" ref="cpFormRef" :rules="rules" label-width="120px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="subForm.password" placeholder="请输入新密码" clearable style="width: 220px;" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="subForm.confirmPassword" placeholder="请确认新密码" clearable style="width: 220px;" type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="submitChangePassword">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
  </div>

</template>

<style scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0 30px;
  position: relative;
}
.title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  font-family: 'Microsoft YaHei', sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.right-tools {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: 'Microsoft YaHei', sans-serif;
}
.right-tools a{
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
}
.right-tools a:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
.right-tools .separator {
  color: rgba(255, 255, 255, 0.6);
}
.second-container .aside {
  border-right: 2px solid #e0e0e0;
  background-color: #f8f9fa;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
