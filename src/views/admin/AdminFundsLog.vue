<script setup>
import {ref,onMounted} from 'vue'
import { getFundsLogApi } from '@/api/admin'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

const initTableData = async() =>{ 
    const res = await getFundsLogApi({
        page: currentPage.value,
        size: pageSize.value
    })
    if(res.code === 200){
        tableData.value = res.data.records
        total.value = res.data.total
        tableData.value.forEach(element => {
            element.updateTime = element.updateTime.replace('T',' ')
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
<h1>资金流水记录</h1>
    <div>
        <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="projectId" label="项目ID" align="center" ></el-table-column>
        <el-table-column prop="applicantId" label="申请人ID" align="center" ></el-table-column>
        <el-table-column prop="appliedFunds" label="申请金额" align="center" ></el-table-column>
        <el-table-column prop="status" label="结果" align="center" >
            <template #default="scope">
                <el-tag v-if="scope.row.status === 0" type="info">待审核</el-tag>
                <el-tag v-if="scope.row.status === 1" type="error">未通过</el-tag>
                <el-tag v-if="scope.row.status === 2" type="success" round>已通过</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="approverId" label="操作人ID" align="center" ></el-table-column>
        <el-table-column prop="updateTime" label="操作时间" align="center" ></el-table-column>
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