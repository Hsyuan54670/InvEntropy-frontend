<script lang="tsx" setup>
import { ElButton } from 'element-plus';
import { ref, computed } from 'vue'


const searchForm = ref({
    projectName: '',
    projectType: ''
})
const statusMap = {
    0: '待审核',
    1: '已驳回',
    2: '已通过',
    3: '进行中',
    4: '已结项',
    5: '已废弃'
}
const timelines=ref([
    {status : 0, time : '2024-05-01 12:00:00'},
    {status : 1, time : '2024-05-02 12:00:00'},
    {status : 2, time : '2024-05-03 12:00:00'},
    {status : 3, time : '2024-05-04 12:00:00'},
    {status : 4, time : '2024-05-04 12:00:00'},
    {status : 5, time : '2024-05-04 12:00:00'},   
])
const drawer = ref(false)
const handleSearch = () => {
    console.log(searchForm.value)
}
const currentId = ref()
const currentProject = computed(() => {
    return playTable.value.find(item => item.id === currentId.value)
})
const ProjectView = (id: number) => {
    drawer.value = true
    currentId.value = id
    console.log(currentId.value)
}
const playTable = ref([
    {
        id: 0,
        projectName: 'xx',
        projectType: 'aa',
        remainingFunds: 10,
        funds: 20,
        finishTime:'2024-05-01T12:00:00',
        content: '23'
    },
    {
        id: 1,
        projectName: '机器学习研究',
        projectType: '基础研究',
        remainingFunds: 45000,
        funds: 50000,
        finishTime:'2024-05-15T12:00:00',
        content: '关于深度学习算法的优化研究...'
    },
])
const columnsTable = [
    { key: 'name', dataKey: 'projectName', title: '项目名称', width: 200 ,align:'center' },
    { key: 'type', dataKey: 'projectType', title: '项目类型', width: 200 ,align:'center' },
    { key: 'content', dataKey: 'content', title: '项目内容', width: 300 ,align:'center' },
    { key: 'finishTime', dataKey: 'finishTime', title: '结项时间', width: 270,align:'center' },
    { key: 'action',title: '操作', 
        cellRenderer: ({rowData}) =>(
            <>
            <ElButton type="success" size="small" onClick={() => ProjectView(rowData.id)} round plain>查看详情</ElButton>
            </>
        ),
        width: 300 ,
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
        finishTime: item.finishTime
    }))
});


</script>

<template>
    <h1>已完成的项目</h1>
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

    <el-drawer v-model="drawer" title="项目详情" :with-header="true">
        <template #default>
            <div v-if="currentProject">
                <p>项目名称：{{ currentProject.projectName }}</p>
                <p>项目类型：{{ currentProject.projectType }}</p>
                <p>项目内容：{{ currentProject.content }}</p>
                <p>结项时间：{{ currentProject.finishTime }}</p>
            </div>
            <div class="timeline">
                <p>项目状态变更时间线：</p>
                <el-timeline style="max-width: 600px">
                  <el-timeline-item
                    v-for="(activity, index) in timelines"
                    :key="index"
                    :timestamp="activity.time"
                    :type="activity.status === 0 ? 'default' : 
                           activity.status === 1 ? 'warning' :
                           activity.status === 2 ? 'info' :
                           activity.status === 3 ? 'primary' :
                           activity.status === 4 ? 'success' :
                           'danger'"
                    :size="activity.status === 1 ? 'large' : 'large'"
                  >
                    {{ statusMap[activity.status] }}
                  </el-timeline-item>
                </el-timeline>
            </div>
        </template>
    </el-drawer>
</template>

<style scoped>
.form-inline {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

</style> 