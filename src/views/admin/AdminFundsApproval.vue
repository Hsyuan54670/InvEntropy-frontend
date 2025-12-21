<script setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import { getFundsApprovalApi } from '@/api/admin'
import { approvalFundsApi,NotApprovalFundsApi } from '@/api/admin'
const tableData = ref([])
const initPlayTable = async () => { 
    const res = await getFundsApprovalApi()
    if(res.code === 200) {
        tableData.value = res.data
        tableData.value.forEach(item=>{
            item.appliedTime=item.appliedTime.replace('T',' ')
        })
    }
}
const comment=ref('')
const ApprovalFunds=async(row)=>{
    ElMessageBox.prompt('通过理由', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入通过理由',
        inputValue:comment.value,
        inputValidator: (value) => {
            if (!value) {
                return '请输入通过理由'
            }
        },
        inputPattern: /^.{1,100}$/,
        inputErrorMessage: '内容不能为空且不能超过100个字符',
    }).then(async ({ value }) => {
        comment.value=value
        const res = await approvalFundsApi(row.appliedFunds,row.id,comment.value)
        if(res.code === 200) {
            ElMessage({
                message: '已通过',
                type: 'success',
            })
            tableData.value = tableData.value.filter(item => item.id !== row.id)
            comment.value=''
        }
    }).catch(() => {})
}
const notApprovalFunds=async(id)=>{
    ElMessageBox.prompt('拒绝理由', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入拒绝理由',
        inputValue:comment.value,
        inputValidator: (value) => {
            if (!value) {
                return '请输入拒绝理由'
            }
        },
        inputPattern: /^.{1,100}$/,
        inputErrorMessage: '内容不能为空且不能超过100个字符',
    }).then(async ({ value }) => { 
        comment.value=value
        const res = await NotApprovalFundsApi(id,comment.value)
        if(res.code === 200) {
            ElMessage({
                message: '已拒绝',
                type: 'info',
            })
            tableData.value = tableData.value.filter(item => item.id !== id)
            comment.value=''
        }
    }).catch(() => {})
}
onMounted(()=>{
    initPlayTable()
})
</script>

<template>
<h1>审批经费</h1>{{comment}}
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="申请ID" v-if="false"/>
            <el-table-column prop="projectId" label="项目ID" width="180" align="center"/>
            <el-table-column prop="appliedTime" label="申请时间" width="180" align="center"/>
            <el-table-column prop="reason" label="申请理由" width="180" align="center"/>
            <el-table-column prop="appliedFunds" label="申请金额" width="180" align="center"/>
            <el-table-column prop="remainingFunds" label="项目余额" width="180" align="center"/>
            <el-table-column prop="applicant" label="项目负责人" width="180" align="center"/>
            <el-table-column prop="op" label="操作"  align="center">
                <template #default="scope">
                    <el-button type="success" @click="ApprovalFunds(scope.row)">通过</el-button>
                    <el-button type="danger" @click="notApprovalFunds(scope.row.id)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped>


</style> 