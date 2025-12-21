<script setup>
import {ref,onMounted} from 'vue'
import { getProjectsLogApi } from '@/api/admin'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

const initTableData = async() =>{ 
    const res = await getProjectsLogApi({
        page: currentPage.value,
        size: pageSize.value
    })
    if(res.code === 200){
        tableData.value = res.data.records
        total.value = res.data.total
        tableData.value.forEach(element => {
            element.createTime = element.createTime.replace('T',' ')
        });
    }
}

const handlePageChange = (page) => {
  currentPage.value = page
  initTableData()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  initTableData()
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
        
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          style="margin-top: 20px; justify-content: center;"
        />

    </div>

</template>

<style scoped>


</style>