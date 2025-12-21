<script setup>
import {ref,onMounted} from 'vue'
import { getProjectsLogApi } from '@/api/admin'

const tableData = ref([])

const initTableData = async() =>{ 
    const res = await getProjectsLogApi()
    if(res.code === 200){
        tableData.value = res.data
        tableData.value.forEach(element => {
            element.createTime = element.createTime.replace('T',' ')
        });
    }
}
onMounted(()=>{
    initTableData()
})
</script>

<template>
<h1>项目管理记录</h1>
    <div>
        <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="projectId" label="项目ID" align="center" ></el-table-column>
        <el-table-column prop="oldStatus" label="原始状态" align="center" ></el-table-column>
        <el-table-column prop="newStatus" label="新状态" align="center" ></el-table-column>
        <el-table-column prop="reason" label="理由" align="center" ></el-table-column>
        <el-table-column prop="approverId" label="操作人ID" align="center" ></el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center" ></el-table-column>
        </el-table>


    </div>

</template>

<style scoped>


</style> 