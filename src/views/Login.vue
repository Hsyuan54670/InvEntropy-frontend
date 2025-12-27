<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import RSACrypto from '@/utils/encryption'
import { loginApi } from '@/api/login'



// 用户类型选项
const userTypes = [
    { label: '普通用户', value: 'user' },
    { label: '管理员用户', value: 'admin' }
]

// 用户登录数据
const user = ref({
    username: '',
    password: '',
    captcha: '', // 验证码
    userType: 'user' // 默认选择普通用户
})

// 验证码图片URL

const router = useRouter()
const captchaUrl = ref('')
// 生成随机验证码
const generateCaptcha = () => {
  // 生成4位随机数字验证码
  const chars = '0123456789';
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * 10));
  }
  // 将验证码存储到localStorage，供后续验证使用
  localStorage.setItem('captcha', captcha);
  // 创建一个简单的canvas图像作为验证码图片
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  
  // 绘制背景
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 绘制干扰线
  ctx.strokeStyle = '#ccc';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
  
  // 绘制验证码文字
  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(captcha, canvas.width / 2, canvas.height / 2);
  
  captchaUrl.value = canvas.toDataURL('image/png');
}

// 登录提交
const loginConfirm = async () => {
    if (!user.value.username || !user.value.password) {
        ElMessage.warning('请输入用户名和密码')
        return
    }
    
    if (!user.value.captcha) {
        ElMessage.warning('请输入验证码')
        return
    }
    
    try {
        // 验证验证码是否正确（不区分大小写）
        const storedCaptcha = localStorage.getItem('captcha');
        if (user.value.captcha.toLowerCase() !== storedCaptcha?.toLowerCase()) {
            ElMessage.error('验证码错误')
            generateCaptcha() // 重新生成验证码
            return
        }
        
        const loginData = {
            ...user.value,
            timestamp: Date.now(),
        }
        // 使用RSA加密密码
        const encryptedPassword = RSACrypto.encryptPassword(loginData.password)
        loginData.password = encryptedPassword

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
            generateCaptcha() // 重新生成验证码
        }
    } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
        console.log('登录失败', error)
        generateCaptcha() // 重新生成验证码
    }
}

// 清空表单
const clear = () => {
    user.value = {
        username: '',
        password: '',
        captcha: '',
        userType: 'user' // 清空时重置为普通用户
    }
    generateCaptcha()
}


onMounted(async() => {
    generateCaptcha()
    try{
        await RSACrypto.getPublicKey()
    }catch(error){
        ElMessage.error('安全模块初始化失败')
    }
    
    
})



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
                
                <el-form-item label="验证码">
                    <div class="captcha-container">
                        <el-input 
                            v-model="user.captcha" 
                            placeholder="请输入验证码" 
                            size="large"
                            maxlength="4"
                            @keyup.enter="loginConfirm"
                        />
                        <img 
                            :src="captchaUrl" 
                            alt="验证码" 
                            class="captcha-img"
                            @click="generateCaptcha"
                        />
                    </div>
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
                        @click="loginConfirm"
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

/* 验证码容器样式 */
.captcha-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.captcha-img {
    width: 100px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    object-fit: cover;
}

.captcha-img:hover {
    opacity: 0.8;
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
    
    .captcha-container {
        flex-direction: column;
    }
}
</style>