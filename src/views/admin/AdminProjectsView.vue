<script setup>
import {ref,onMounted, computed} from 'vue'
import {getAllProjectsApi} from '@/api/admin'
const tableData = ref([])


const currentPage = ref(1)
const pageSize = ref(5)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const total = computed(() => {
  return tableData.value.length
})
const handlePageChange = (page) => {
  currentPage.value = page
}
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}


const initTableData = async()=>{
    const res = await getAllProjectsApi()
    if(res.code === 200){
        tableData.value = res.data
        tableData.value.forEach(item=>{
            item.deadline=item.deadline.replace('T',' ')
            item.startTime=item.startTime.replace('T',' ')
        })
    }
}



onMounted(()=>{
    initTableData()
})
</script>

<template>
<h1>项目列表</h1>
    <div>
        <el-table :data="paginatedData" border style="width: 100%">
        <el-table-column prop="id" label="项目ID" align="center" ></el-table-column>
        <el-table-column prop="projectName" label="项目名称" align="center" ></el-table-column>
        <el-table-column prop="projectType" label="项目类型" align="center" ></el-table-column>
        <el-table-column prop="status" label="项目状态" align="center" ></el-table-column>
        <el-table-column prop="applicantId" label="负责人ID" align="center" ></el-table-column>
        <el-table-column prop="applicant" label="负责人" align="center" ></el-table-column>
        <el-table-column prop="funds" label="总资金" align="center" ></el-table-column>
        <el-table-column prop="remainingFunds" label="剩余资金" align="center" ></el-table-column>
        <el-table-column prop="content" label="内容" align="center" >
            <template #default="scope">
                <a :href="scope.row.content" class="a-content">{{scope.row.content.split('/')[scope.row.content.split('/').length-1]}}</a>
            </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" ></el-table-column>
        <el-table-column prop="deadline" label="截止时间" align="center" ></el-table-column>
        <el-table-column prop="op" label="操作" align="center" ></el-table-column>

        </el-table>
        
        <el-pagination
          v-model:current-page="page"
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

<style>
.a-content{
    color: rgb(99, 174, 215);
    text-decoration: none;
}
</style>