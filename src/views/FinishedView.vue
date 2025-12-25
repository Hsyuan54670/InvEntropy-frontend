<script lang="tsx" setup>
import { ElButton } from 'element-plus';
import { ref, computed, onMounted } from 'vue'
import { getFinishedProjectsApi,getTimeLinesApi } from '@/api/project'



const searchForm = ref({
    projectName: '',
    projectType: ''
})
const statusMap = {
    0: '待审核',
    1: '已驳回',
    2: '已逾期',
    3: '进行中',
    4: '已结项',
    5: '已废弃'
}
const timelines=ref([])
const drawer = ref(false)
const handleSearch = () => {
    console.log(searchForm.value)
}
const currentId = ref()
const currentProject = computed(() => {
    return playTable.value.find(item => item.id === currentId.value)
})
const ProjectView = (id: number) => {
    currentId.value = id
    initTimeLines(id)
    drawer.value = true
    console.log(currentId.value)
}
const initTimeLines=async(id)=>{
    const res = await getTimeLinesApi(id)
    if(res.code === 200) {
        timelines.value = res.data
        timelines.value.forEach(item=> {item.createTime=item.createTime.replace('T',' ')})
    }
}
const playTable = ref([])
const initPlayTable = async () => {
    const res = await getFinishedProjectsApi()
    if(res.code === 200) {
        playTable.value = res.data
        playTable.value.forEach(item=> {item.deadline=item.deadline.replace('T',' ')})
    }
}
const columnsTable = [
    { key: 'name', dataKey: 'projectName', title: '项目名称', width: 200 ,align:'center' },
    { key: 'type', dataKey: 'projectType', title: '项目类型', width: 200 ,align:'center' },
    { key: 'content', dataKey: 'content', title: '项目内容', width: 300 ,align:'center' },
    { key: 'deadline', dataKey: 'deadline', title: '结项时间', width: 270,align:'center' },
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
        deadline: item.deadline
    }))
});

onMounted(() => {
    initPlayTable()
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
                <p>结项时间：{{ currentProject.deadline }}</p>
            </div>
            <div class="timeline">
                <p>项目状态变更时间线：</p>
                <el-timeline style="max-width: 600px">
                  <el-timeline-item
                    v-for="(activity, index) in timelines"
                    :key="index"
                    :timestamp="activity.createTime"
                    :type="activity.newStatus === 0 ? 'default' : 
                           activity.newStatus === 1 ? 'warning' :
                           activity.newStatus === 2 ? 'danger' :
                           activity.newStatus === 3 ? 'primary' :
                           activity.newStatus === 4 ? 'success' :
                           'info'"
                    :size="activity.newStatus === 1 ? 'large' : 'large'"
                  >
                    {{ statusMap[activity.newStatus] }}
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