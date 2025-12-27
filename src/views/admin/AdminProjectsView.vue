<script setup>
import {ref,onMounted} from 'vue'
import {getAllProjectsApi} from '@/api/admin'
import {updateProjectStatusApi,deleteProjectApi,updateDeadlineApi,getAllProjectsApiByCondition} from '@/api/project'
import {ElMessageBox,ElMessage} from 'element-plus'
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

const newDeadline=ref(null)
const dialogVisible = ref(false)
const cache =ref({
    row:null,
    newStatus:null
})


const initTableData = async()=>{
    const res = await getAllProjectsApi({
        page: currentPage.value,
        size: pageSize.value
    })
    if(res.code === 200){
        tableData.value = res.data.records
        total.value = res.data.total
        tableData.value.forEach(item=>{
            item.deadline=item.deadline.replace('T',' ')
            item.startTime=item.startTime.replace('T',' ')
        })
    }
}

const handlePageChange = (page) => {
  currentPage.value = page
  initTableData()
}
const set = async(row,status)=>{
    const res = await updateProjectStatusApi({
        id: row.id,
        newStatus: status
    })
    if(res.code === 200){
        ElMessage({
            message: "操作成功",
            type: "success",
        });
        initTableData()
    }
}
const deleteById = async(id)=>{
    const res = await deleteProjectApi(id)
    if(res.code === 200){
        ElMessage({
            message: "操作成功",
            type: "success",
        });
        initTableData()
    }
}
const confirmBoxForSet = async(row,status) => {
  return ElMessageBox.confirm("确定要执行该操作吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "primary",
  }).then(() => {
    return set(row,status)
  }).catch(() => {})
}
const confirmBoxForDeleteProject = async(id) => {
  return ElMessageBox.confirm("确定要执行该操作吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "primary",
  }).then(() => {
    return deleteById(id)
  }).catch(() => {})
}
const filterTag = (value,row) => {
  return row.status === value
}
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  initTableData()
}
const confirmBoxForMoreTime=async(row,status) => { 
    dialogVisible.value = true
    cache.value.row=row
    cache.value.newStatus=status
}
const closeAndRun = async() => {
    dialogVisible.value = false 
    const res = await updateDeadlineApi({
        id: cache.value.row.id,
        newStatus: cache.value.newStatus,
        newDeadline: newDeadline.value
    })
    if(res.code === 200){
        ElMessage({
            message: "操作成功",
            type: "success",
        });
        initTableData()
    }
}
// 禁用今天及今天之前的日期
const disablePastDatetimes = (date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    return date.getTime() < today.getTime();
}
const closeAndClear = () => {
    dialogVisible.value = false
    newDeadline.value = null
    cache.value.row=null
    cache.value.newStatus=null
}
onMounted(()=>{
    initTableData()
})
const searchForm =ref({
    page:1,
    size:5,
    projectId: '',
    applicant: '',
})
const handleSearch = async() => { 
    const res = await getAllProjectsApiByCondition(searchForm.value,{
        page: currentPage.value,
        size: pageSize.value,
        projectId: searchForm.value.projectId,
        applicant: searchForm.value.applicant
    })
    if(res.code === 200){
        tableData.value = res.data.records
        total.value = res.data.total
        tableData.value.forEach(item=>{
            item.deadline=item.deadline.replace('T',' ')
            item.startTime=item.startTime.replace('T',' ')
        })
    }
}
const clearSearch = () => { 
    searchForm.value.projectId = ''
    searchForm.value.applicant = ''
    initTableData()
}
</script>

<template>
<h1>项目列表</h1>
<div class="search-form">
        <el-form :inline="true" :model="searchForm" class="form-inline">
            <el-form-item label="项目ID" style="width: 330px;">
                <el-input v-model="searchForm.projectId" placeholder="请输入项目id"></el-input>
            </el-form-item>
            <el-form-item label="姓名" style="width: 330px;">
                <el-input v-model="searchForm.applicant" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button  @click="clearSearch">重置</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div>
        <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="项目ID" align="center" ></el-table-column>
        <el-table-column prop="projectName" label="项目名称" align="center" ></el-table-column>
        <el-table-column prop="projectType" label="项目类型" align="center" ></el-table-column>
        <el-table-column prop="status" label="项目状态" align="center" 
            :filters="[
                {text:'已逾期', value: 2},
                {text:'进行中', value: 3},
                {text:'已完成', value: 4},
                {text:'已废弃', value: 5},
            ]"
            :filter-method="filterTag"
        >
            <template #default="scope">
                <el-tag v-if="scope.row.status==2" type="danger">已逾期</el-tag>
                <el-tag v-if="scope.row.status==3" type="primary">进行中</el-tag>
                <el-tag v-if="scope.row.status==4" type="success">已完成</el-tag>
                <el-tag v-if="scope.row.status==5" color="#000" style="color: #fff;" >已废弃</el-tag>
            </template>
        </el-table-column>
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
        <el-table-column prop="op" label="操作" align="center" >
            <template #default="scope">
                <el-button v-if="scope.row.status==2" type="primary" @click="confirmBoxForMoreTime(scope.row,3)">延期</el-button>
                <el-button v-if="scope.row.status==2" type="info" @click="confirmBoxForSet(scope.row,5)">废弃</el-button>
                <el-button v-if="scope.row.status==3" type="success" @click="confirmBoxForSet(scope.row,4)">结项</el-button>
                <el-button v-if="scope.row.status==3" type="info" @click="confirmBoxForSet(scope.row,5)">废弃</el-button>
                <el-button v-if="scope.row.status==5" type="danger" @click="confirmBoxForDeleteProject(scope.row.id)">删除</el-button>

            </template>
        </el-table-column>

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
    <div>
        <el-dialog
            v-model="dialogVisible"
            title="Tips"
            width="500"
            :before-close="handleClose"
        >
            <el-date-picker
                v-model="newDeadline"
                type="datetime"
                value-format="YYYY-MM-DDTHH:mm:ss"
                placeholder="选择截止时间"
                :clearable="true"
                :disabled-date="disablePastDatetimes"
                style="width: 220px;"
            />
            <el-button type="primary" @click="closeAndRun()">确定</el-button>
            <el-button @click="closeAndClear()">取消</el-button>
        </el-dialog>
    </div>
    
</template>

<style>
.a-content{
    color: rgb(99, 174, 215);
    text-decoration: none;
}
</style>