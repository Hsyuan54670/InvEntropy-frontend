<script lang="tsx" setup>
import { ElButton } from 'element-plus';
import { ref, computed } from 'vue'

const searchForm = ref({
    projectName: '',
    projectType: ''
})
const payForm = ref({
    funds: 0
})
const handleSearch = () => {
    console.log(searchForm.value)
}
const dialogVisible = ref(false)
const payFunds = (id: number) => {
    dialogVisible.value = true
    console.log(id)
}
const submitPayFunds = async () => {
    console.log(payForm.value)
}
const playTable = ref([
    {
        id: 0,
        projectName: 'xx',
        projectType: 'aa',
        remainingFunds: 10,
        funds: 20,
        deadline:'2024-05-01T12:00:00',
        content: '23'
    },
    {
        id: 1,
        projectName: '机器学习研究',
        projectType: '基础研究',
        remainingFunds: 45000,
        funds: 50000,
        deadline:'2024-05-15T12:00:00',
        content: '关于深度学习算法的优化研究...'
    },
])
const columnsTable = [
    { key: 'name', dataKey: 'projectName', title: '项目名称', width: 200 },
    { key: 'type', dataKey: 'projectType', title: '项目类型', width: 150 },
    { key: 'remainingFunds', dataKey: 'remainingFunds', title: '剩余资金', width: 100 },
    { key: 'funds', dataKey: 'funds', title: '总资金', width: 100 },
    { key: 'content', dataKey: 'content', title: '项目内容', width: 270 },
    { key: 'deadline', dataKey: 'deadline', title: '截止时间', width: 200 },
    { key: 'action', title: '操作', 
        cellRenderer: ({rowData}) =>(
            <>
            <ElButton type="warning" size="small" onClick={() => payFunds(rowData.id)} round plain>申报经费</ElButton>
            </>
        ),
        width: 240 ,
        align: 'center'
    }
]

const playTableData = computed(() => {
    return playTable.value.map(item => ({
        id: item.id,
        parentId: null,
        projectName: item.projectName,
        projectType: item.projectType,
        remainingFunds: `¥${item.remainingFunds.toLocaleString()}`,
        funds: `¥${item.funds.toLocaleString()}`,
        content: item.content,
        deadline: item.deadline
    }))
});

const rules = ref({
    funds: [
        { required: true, message: '请输入申报经费', trigger: 'blur' },
        { min: 0, message: '申报经费不能小于0', trigger: 'blur' }
    ]
})
</script>

<template>
    <h1>进行中的项目</h1>
    <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="form-inline">
            <el-form-item label="项目名称" style="width: 330px;">
                <el-input v-model="searchForm.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="项目类型" style="width: 330px;">
                <el-select v-model="searchForm.projectType" placeholder="请选择项目类型">
                    <el-option label="项目类型1" value="1"></el-option>
                    <el-option label="项目类型2" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="table-container">
        <el-card class="play-table" style="width: 98%; height: 680px;">
            <el-auto-resizer>
                <template #default="{ height, width }">
                    <el-table-v2
                        :columns="columnsTable"
                        :data="playTableData"
                        :width="width"
                        :height="height"
                        fixed
                    />
                </template>
            </el-auto-resizer>
        </el-card>
    </div>

    <div class="change-password-dialog">
    <el-dialog title="申报经费" 
     v-model="dialogVisible" 
      width="400px"
    >
      <el-form :model="payForm" ref="cpFormRef" :rules="rules" label-width="120px">
        <el-form-item label="申报经费" prop="funds">
          <el-input v-model="payForm.funds" placeholder="请输入申报经费" clearable style="width: 220px;" type="number" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="submitPayFunds">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.form-inline {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

</style> 