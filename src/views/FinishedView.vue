<script lang="tsx" setup>
import { ElButton } from 'element-plus';
import { ref, computed } from 'vue'

const searchForm = ref({
    projectName: '',
    projectType: ''
})

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
    { key: 'action', title: '操作', 
        cellRenderer: () =>(
            <>
            <ElButton type="success" size="small" round plain>查看详情</ElButton>
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
</template>

<style scoped>
.form-inline {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

</style> 