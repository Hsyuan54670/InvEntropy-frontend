<script lang="tsx" setup>
import { ElButton } from 'element-plus';
import { ref, computed } from 'vue'

const searchForm = ref({
    projectName: '',
    status: null
})

const playTable = ref([
    {
        id: 0,
        projectName: 'xx',
        status:0,
        approver: '无',
        reason: '项目经费不足',
        createTime: null
    },
    {
        id: 1,
        projectName: '机器学习研究',
        status:1,
        approver: '李四',
        reason: '理由不充分',
        createTime: '2023-08-15T12:00:00'
    },
])
const columnsTable = [
    { key: 'name', dataKey: 'projectName', title: '项目名称', width: 200 },
    { key: 'status', dataKey: 'status', title: '项目状态', width: 200, align: 'center',
        cellRenderer: ({ cellData: name }) => {
            return name === '未通过' ? <ElTag type="danger">{name}</ElTag> : <ElTag type="info">{name}</ElTag>
        },
    },
    { key: 'reason', title: '意见',
        cellRenderer: () =>(
            <>
                <ElButton type="primary" size="small" round plain>查看详情</ElButton>
            </>
        ),
        width: 400 ,
        align: 'center'
        },
    // { key: 'action', title: '操作', 
    //     cellRenderer: () =>(
    //         <>
    //             <ElButton type="success" size="small" round plain>重新申报</ElButton>
    //         </>
    //     ),
    //     width: 180 ,
    //     align: 'center'
    // }
    { key: 'approver', dataKey: 'approver', title: '审批人', width: 200, align: 'center' },
    { key: 'createTime', dataKey: 'createTime', title: '申报时间', width: 200, align: 'center',
        cellRenderer: ({ cellData: name }) => {
            return name ? name.split('T')[0]+' '+name.split('T')[1].split('.')[0] : '无'
        },
    },
]

const playTableData = computed(() => {
    return playTable.value.map(item => ({
        id: item.id,
        parentId: null,
        projectName: item.projectName,
        status: item.status === 1 ? '未通过' : '未审批',
        approver: item.approver,
        createTime: item.createTime
    }))
});


</script>

<template>
    <h1>未通过的项目</h1>
    <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="form-inline">
            <el-form-item label="项目名称" style="width: 330px;">
                <el-input v-model="searchForm.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="项目状态" style="width: 330px;">
                <el-select v-model="searchForm.status" placeholder="请选择项目状态">
                    <el-option label="未审批" value=1></el-option>
                    <el-option label="未通过" value=0></el-option>
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