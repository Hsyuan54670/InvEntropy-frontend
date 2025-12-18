<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { submitProjectApi } from '@/api/project'

const projectTypes = ref([
    { value: 1 , label: '纵向项目' },
    { value: 2 , label: '横向项目' },
    { value: 3 , label: '校内项目' },
])

const subForm = ref({
    projectName: '',
    projectType: null,
    applicant: '',
    applicantId: '',
    funds: '',
    content: '',
    deadline: '',
})
subForm.value.applicantId = JSON.parse(localStorage.getItem('loginUser')).id
// 表单验证规则
const rules = {
    projectName: [
        { required: true, message: '项目名称不能为空', trigger: 'blur' },
    ],
    projectType: [
        { required: true, message: '项目类型不能为空', trigger: 'change' },
    ],
    applicant: [
        { required: true, message: '项目负责人不能为空', trigger: 'blur' },
    ],
    funds: [
        { required: true, message: '项目经费不能为空', trigger: 'blur' },
        { type: 'number', message: '只能输入正数', trigger: 'change' },
        { min: 0, message: '项目经费不能为负数', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '项目内容不能为空', trigger: 'blur' },
    ],
    deadline: [
        //{ required: true, message: '截止日期不能为空', trigger: 'blur' },
        //{ validator: (val) => new Date(val) > new Date(), message: '截止日期必须大于当前日期', trigger: 'blur' },
    ],
}
// 禁用今天及今天之前的日期
const disablePastDatetimes = (date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    return date.getTime() < today.getTime();
}


// 上传文件前的校验函数
const beforeFileUpload = (file) => {
    const allowedTypes = ['.doc', '.docx', '.xls', '.xlsx', '.pdf']
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
        ElMessage.error('仅支持上传 Word、Excel、PDF 格式的文件！')
        return false
    }
    const sizeLimit = 10 * 1024 * 1024 // 10MB
    if (file.size > sizeLimit) {
        ElMessage.error('单个文件大小不能超过10MB！')
        return false
    }
    return true
}
const afterUpload =(response)=>{
    subForm.value.content=response.data
    console.log('上传成功后的响应数据:', response.data)
}

onMounted(() => {
    console.log('初始 deadline 值:', subForm.value.deadline);
    console.log('初始 deadline 类型:', typeof subForm.value.deadline);
});

// 表单提交函数
const submitForm = () => {
    console.log('提交的表单数据:', subForm.value)
    submitProjectApi(subForm.value).then(res => {
        if (res.code === 200) {
            ElMessage.success('项目提交成功！')
        } else {
            ElMessage.error(res.msg || '项目提交失败')
        }
    })
}

// 清空表单函数
const clear = () => {
    subForm.value = {
        projectName: '',
        projectType: '',
        applicant: '',
        funds: '',
    }
    ElMessage.info('表单已清空')
}
</script>

<template>
<h1>申报项目</h1>

<div class="card-container">
  <el-card style="max-width: 1600px">
    <template #header>
      <div class="card-header">
        <span class="card-title">项目申报书</span>
      </div>
    </template>
    <div class="card-content">
        <!-- 项目申报书内容 -->
        <el-form :model="subForm" :rules="rules" label-width="120px">
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="subForm.projectName" placeholder="请输入项目名称" clearable style="width: 220px;" type="text" />
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
                <el-select v-model="subForm.projectType" placeholder="请选择项目类型" clearable style="width: 220px;">
                    <el-option
                        v-for="type in projectTypes"
                        :key="type.value"
                        :label="type.label"
                        :value="type.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="项目负责人" prop="applicant">
                <el-input v-model="subForm.applicant" placeholder="请输入项目负责人" clearable style="width: 220px;" type="text" />
            </el-form-item>
            <el-form-item label="项目经费" prop="funds">
                <el-input v-model="subForm.funds" placeholder="请输入项目经费" style="width: 220px;" type="number" >
                    <template #suffix>
                        <span>RMB</span>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="项目内容" prop="content">
                <el-upload
                    class="content-upload"
                    drag
                    action="/api/upload"
                    multiple
                    :before-upload="beforeFileUpload"
                    :on-success="afterUpload"
                    accept=".doc,.docx,.xls,.xlsx,.pdf"
                >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖拽文件到这里或<em>点击此处上传</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            仅支持word、excel、pdf文件,单个文件大小不超过10MB
                        </div>
                    </template>
                </el-upload>
            </el-form-item>

            <el-form-item label="截止日期" prop="deadline">
                <el-date-picker
                    v-model="subForm.deadline"
                    type="datetime"
                    value-format="YYYY-MM-DDTHH:mm:ss"
                    placeholder="选择截止时间"
                    :clearable="true"
                    :disabled-date="disablePastDatetimes"
                    style="width: 220px;"
                />
            </el-form-item>

        </el-form>
    </div>
    <template #footer>
        <div class="card-footer">
            <el-button type="primary" size="large" @click="submitForm">提交</el-button>
            <el-button type="default" size="large" @click="clear">清空</el-button>
        </div>
    </template>
  </el-card>
</div>

</template>

<style scoped>
.card-title {
    font-size: 24px;
    font-weight: bold;
}
.card-footer{
    display: flex;
    justify-content: flex-end;
}

</style>