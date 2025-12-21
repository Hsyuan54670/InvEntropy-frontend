<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/login'
import { useRouter } from 'vue-router'

// 用户类型选项
const userTypes = [
    { label: '普通用户', value: 'user' },
    { label: '管理员用户', value: 'admin' }
]

// 用户登录数据
const user = ref({
    username: '',
    password: '',
    userType: 'user' // 默认选择普通用户
})

const router = useRouter()

// 登录提交
const submitForm = async () => {
    if (!user.value.username || !user.value.password) {
        ElMessage.warning('请输入用户名和密码')
        return
    }
    
    try {
        // 添加用户类型信息到登录数据
        const loginData = {
            ...user.value,
            userType: user.value.userType
        }
        
        const result = await loginApi(loginData)
        if (result.code == 200) {
            ElMessage.success('登录成功！')
            localStorage.setItem('loginUser', JSON.stringify(result.data))
            if(user.value.userType === 'admin'){
                router.push('/admin')
            }else{
                router.push('/layout')
            }
            clear()
        } else {
            ElMessage.error('请输入正确的用户名或密码以及正确的用户类型')
        }
    } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
    }
}

// 清空表单
const clear = () => {
    user.value = {
        username: '',
        password: '',
        userType: 'user' // 清空时重置为普通用户
    }
}
</script>

<template>
    <div class="login-container">
        <!-- 左侧装饰图形 -->
        <div class="decoration-left">
            <div class="geometric-shape shape-1"></div>
            <div class="geometric-shape shape-2"></div>
            <div class="geometric-shape shape-3"></div>
        </div>
        
        <!-- 登录卡片 -->
        <div class="login-card">
            <div class="card-header">
                <h1 class="title">登录系统</h1>
                <p class="subtitle">欢迎回来，请登录您的账户</p>
            </div>
            
            <el-form :model="user" class="login-form" label-width="80px">

                <el-form-item label="用户名">
                    <el-input 
                        v-model="user.username" 
                        placeholder="请输入用户名" 
                        size="large"
                        prefix-icon="User"
                        clearable
                    />
                </el-form-item>
                
                <el-form-item label="密码">
                    <el-input 
                        v-model="user.password" 
                        type="password"
                        placeholder="请输入密码" 
                        size="large"
                        prefix-icon="Lock"
                        show-password
                        clearable
                    />
                </el-form-item>

                <el-form-item label="用户类型">
                    <el-radio-group v-model="user.userType" size="large">
                        <el-radio-button 
                            v-for="type in userTypes" 
                            :key="type.value" 
                            :label="type.value"
                            :class="{ 'active-radio': user.userType === type.value }"
                        >
                            {{ type.label }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                
                <div class="form-actions">
                    <el-button 
                        type="primary" 
                        size="large" 
                        @click="submitForm"
                        class="login-btn"
                    >
                        登录
                    </el-button>
                    <el-button 
                        type="default" 
                        size="large" 
                        @click="clear"
                        class="clear-btn"
                    >
                        清空
                    </el-button>
                </div>
            </el-form>
            
            <div class="card-footer">
                <p class="footer-text">XX大学项目管理系统</p>
            </div>
        </div>
        
        <!-- 右侧装饰图形 -->
        <div class="decoration-right">
            <div class="geometric-shape shape-4"></div>
            <div class="geometric-shape shape-5"></div>
            <div class="geometric-shape shape-6"></div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

/* 装饰图形 */
.decoration-left,
.decoration-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    opacity: 0.1;
}

.decoration-left {
    left: 0;
    align-items: flex-start;
}

.decoration-right {
    right: 0;
    align-items: flex-end;
}

.geometric-shape {
    background: #2c3e50;
    border-radius: 8px;
}

.shape-1 { width: 80px; height: 80px; transform: rotate(45deg); }
.shape-2 { width: 60px; height: 60px; border-radius: 50%; }
.shape-3 { width: 100px; height: 40px; }
.shape-4 { width: 70px; height: 70px; transform: rotate(30deg); }
.shape-5 { width: 50px; height: 50px; border-radius: 10px; }
.shape-6 { width: 90px; height: 30px; }

/* 登录卡片 */
.login-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 420px;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.card-header {
    text-align: center;
    margin-bottom: 40px;
}

.title {
    font-size: 28px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.subtitle {
    font-size: 14px;
    color: #7f8c8d;
    margin: 0;
}

/* 表单样式 */
.login-form {
    margin-bottom: 30px;
}

.login-form :deep(.el-form-item__label) {
    font-weight: 500;
    color: #2c3e50;
}

/* 用户类型选择器样式 */
.login-form :deep(.el-radio-group) {
    width: 100%;
    display: flex;
    gap: 8px;
}

.login-form :deep(.el-radio-button) {
    flex: 1;
}

.login-form :deep(.el-radio-button__inner) {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    background: #f8f9fa;
    color: #606266;
    transition: all 0.3s ease;
}

.login-form :deep(.el-radio-button__inner:hover) {
    border-color: #3498db;
    color: #3498db;
}

.login-form :deep(.el-radio-button.is-active .el-radio-button__inner) {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    border-color: #3498db;
    color: white;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

/* 输入框样式 */
.login-form :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form :deep(.el-input__wrapper:hover) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.login-form :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

/* 按钮样式 */
.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 30px;
}

.login-btn {
    flex: 1;
    border-radius: 8px;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    border: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.clear-btn {
    flex: 1;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    color: #606266;
    transition: all 0.3s ease;
}

.clear-btn:hover {
    border-color: #3498db;
    color: #3498db;
    transform: translateY(-1px);
}

/* 底部信息 */
.card-footer {
    text-align: center;
    border-top: 1px solid #f0f0f0;
    padding-top: 20px;
}

.footer-text {
    font-size: 12px;
    color: #95a5a6;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .login-card {
        width: 90%;
        margin: 20px;
        padding: 30px 20px;
    }
    
    .decoration-left,
    .decoration-right {
        display: none;
    }
}
</style>