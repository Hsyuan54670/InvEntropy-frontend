<script setup>
import { ref,onMounted } from 'vue'
import { getAccountApi, addAccountApi,deleteAccountApi} from '@/api/admin';
import { ElMessage,ElMessageBox } from 'element-plus'
const tableData = ref([])


const initTableData = async()=>{
    const res = await getAccountApi()
    if(res.code === 200){ 
        tableData.value = res.data
    }
}
const AccountForm=ref(
    {
        phone:'',
        name:'',
        college:'',
        gender:'',
        age:'',
    }
)
const formRef = ref(null)
const dialogVisible = ref(false)
const addAccount=()=>{ 
    dialogVisible.value = true
}
const submitForm = async()=>{
    const res = await addAccountApi(AccountForm.value)
    if(res.code === 200){ 
        ElMessage.success('添加成功！')
        dialogVisible.value = false
        initTableData()
    }else{
        ElMessage.error(res.msg || '添加失败')
    } 
}

const deleteConfirm = (id) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm('此操作会删除所有相关数据，确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            resolve(deleteRow(id))
        }).catch(() => {
            reject()
        })
    })
}


const deleteRow = async(id) => {
    const res = await deleteAccountApi(id)
    if (res.code === 200) {
        ElMessage.success('删除成功！')
        tableData.value = tableData.value.filter(item => item.id !== id)
    } else {
        ElMessage.error(res.msg || '删除失败')
    }

}
const clear = () => {
    dialogVisible.value = false
    formRef.value.resetFields()
}
onMounted(()=>{
    initTableData()
})

const rules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入手机号'));
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        }, trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'submit' },
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' },
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        { type: 'number', message: '年龄必须为数字值', trigger: ['blur', 'change'] }
    ],
    collge: [
        { required: true, message: '请选择学院', trigger: 'blur' },
    ],
}
</script>

<template>
<h1>教师账号管理</h1>
    <div>
        <div style="margin-bottom: 20px;">
            <el-button type="primary" size="large" @click="addAccount">
                <el-icon><Plus /></el-icon>新增账号
            </el-button>
        </div>

        <div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="账号ID" prop="id" align="center"></el-table-column>
                <el-table-column label="账号" prop="username" align="center"></el-table-column>
                <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
                <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="danger" @click="deleteConfirm(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>

    <div>
        <el-dialog v-model="dialogVisible" title="新增账号" width="500px">
            <el-form ref="formRef" :rules="rules" label-width="120px"  :model="AccountForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="AccountForm.name" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                     <el-radio-group v-model="AccountForm.gender">
                        <el-radio label="M" >男</el-radio>
                        <el-radio label="F" >女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="AccountForm.age" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="AccountForm.phone" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="学院" prop="collge">
                    <el-input v-model="AccountForm.college" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button type="primary" size="large" @click="submitForm">新建</el-button>
                    <el-button type="default" size="large" @click="clear">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>


</style> 