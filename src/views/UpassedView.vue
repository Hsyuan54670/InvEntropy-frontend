<script lang="tsx" setup>
import { ElButton } from 'element-plus';
import { te } from 'element-plus/es/locale';
import { ref, computed, onMounted } from 'vue'
import { getUnpassedProjectsApi } from '@/api/project'
const searchForm = ref({
    projectName: '',
    status: null
})
const handleSearch = () => {
    console.log(searchForm.value)
}

const dialogVisible = ref(false)
const currentReason = ref('')
const handleClick = (reason: string) => {
    currentReason.value = reason
    dialogVisible.value = true
    console.log(currentReason.value)
}


const playTable = ref([])
const initPlayTable =async() => { 
    const res = await getUnpassedProjectsApi()
    if(res.code === 200) {
        playTable.value = res.data
    }
}
const columnsTable = [
    { key: 'id', dataKey: 'id', title: '项目ID',  align: 'center', hidden: true },
    { key: 'name', dataKey: 'projectName', title: '项目名称', width: 200 },
    { key: 'status', dataKey: 'status', title: '项目状态', width: 200, align: 'center',
        cellRenderer: ({ cellData: name }) => {
            return name === '未通过' ? <ElTag type="danger">{name}</ElTag> : <ElTag type="info">{name}</ElTag>
        },
    },
    { key: 'reason', dataKey: 'reason', title: '意见',
        cellRenderer: ({ cellData: reason }) =>(
                <ElButton type="primary" size="small" onClick={()=>handleClick(reason)} round plain>查看详情</ElButton>
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
    { key: 'createTime', dataKey: 'createTime', title: '审批时间', width: 200, align: 'center',
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
        createTime: item.createTime,
        reason: item.reason
    }))
});

onMounted(() => {
    initPlayTable()
})
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

    <div class="dialog-container">
        <el-dialog title="审批意见" 
         v-model="dialogVisible" 
          width="600px"
        >
        {{currentReason}}
            <template #footer>
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
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