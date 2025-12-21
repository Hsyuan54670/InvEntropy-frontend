<script setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import { getProjectsApprovalApi,approvalProjectApi, NotApprovalProjectApi } from '@/api/admin'
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

const initTableData=async()=>{
    const res = await getProjectsApprovalApi({
        page: currentPage.value,
        size: pageSize.value
    })
    if(res.code === 200) {
        tableData.value = res.data.records
        total.value = res.data.total
    }
    tableData.value.forEach(item=>{
        item.deadline=item.deadline.replace('T',' ')
        item.startTime=item.startTime.replace('T',' ')
    })
}

const handleApproval = async (id) => {
    ElMessageBox.confirm('确定通过吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(async () => {
        const res = await approvalProjectApi(id)
        if(res.code === 200) {
            ElMessage({
                message: '已通过',
                type: 'success',
            })
            tableData.value = tableData.value.filter(item => item.id !== id)
        }
    })
}
const dialogView=ref(false)
const reason=ref('')
const curId=ref();
const notApproval = async(id)=>{
    dialogView.value=true
    curId.value=id
}
const confirmNotApproval=async()=>{
    const res = await NotApprovalProjectApi(curId.value,reason.value)
    if(res.code === 200) {
        ElMessage({
            message: '已驳回',
            type: 'success',
        })
        tableData.value = tableData.value.filter(item => item.id !== curId.value)
        dialogView
    }
    clearReason()
}
const clearReason=()=>{
    reason.value=''
    dialogView.value=false
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
<h1>待审批项目</h1>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="projectName" label="项目名称" width="180" align="center"/>
            <el-table-column prop="startTime" label="申请时间" width="180" align="center"/>
            <el-table-column prop="deadline" label="截止时间" width="180" align="center"/>
            <el-table-column prop="content" label="项目内容" width="180" align="center">
                <template #default="scope">
                    <a :href="scope.row.content" class="a-content">{{scope.row.content.split('/')[scope.row.content.split('/').length-1]}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="applicant" label="项目负责人" width="180" align="center"/>
            <el-table-column prop="funds" label="项目经费" width="180" align="center"/>
            <el-table-column prop="op" label="操作"  align="center">
                <template #default="scope">
                    <el-button type="success" @click="handleApproval(scope.row.id)">通过</el-button>
                    <el-button type="danger" @click="notApproval(scope.row.id)">拒绝</el-button>
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
        <el-dialog v-model="dialogView" title="驳回理由" width="400px">
            <el-input v-model="reason" placeholder="请输入理由" type="textarea"></el-input>
            <template #footer>
                <el-button @click="clearReason()">取消</el-button>
                <el-button type="primary" @click="confirmNotApproval()">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>


</style>