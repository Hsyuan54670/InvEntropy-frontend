<script setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import { getFundsApprovalApi } from '@/api/admin'

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
onMounted(()=>{
    initPlayTable()
})
</script>

<template>
<h1>审批经费</h1>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="projectId" label="项目ID" width="180" align="center"/>
            <el-table-column prop="appliedTime" label="申请时间" width="180" align="center"/>
            <el-table-column prop="reason" label="申请理由" width="180" align="center"/>
            <el-table-column prop="appliedFunds" label="申请金额" width="180" align="center"/>
            <el-table-column prop="remainingFunds" label="项目余额" width="180" align="center"/>
            <el-table-column prop="applicant" label="项目负责人" width="180" align="center"/>
            <el-table-column prop="op" label="操作"  align="center">
                <template #default="scope">
                    <el-button type="success" @click="handleApproval(scope.row.id)">通过</el-button>
                    <el-button type="danger" @click="notApproval(scope.row.id)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<!-- todo 通过拒绝 -->
<style scoped>


</style> 