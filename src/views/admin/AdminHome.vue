<script setup>
import { onMounted, ref } from 'vue'
import { getWorkApi,getFundsApi,getKindsApi } from '@/api/admin'
const work=ref({
    projectsRecords:0,
    fundsRecords:0,
    projectsOverTime:0
})
const fundsManager=ref({
    totalFunds:0,
    totalRemainingFunds:0
})
const projectManager=ref({
    projects:0,
    projectsOf2:0,
    projectsOf3:0,
    projectsOf4:0,
    projectsOf5:0
})
const initWork=async()=>{
    const res = await getWorkApi()
    if(res.code === 200) {
        work.value = res.data
    }

}
const initFunds=async()=>{
    const res = await getFundsApi()
    if(res.code === 200) {
        fundsManager.value = res.data
    }

}
const initProject=async()=>{
    const res = await getKindsApi()
    if(res.code === 200) {
        projectManager.value = res.data
    }

}
onMounted(()=>{
    initWork()
    initFunds()
    initProject()
})
</script>


<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>工作</span>
            </div>
          </template>
          <div class="card-content">
            <ul>
              <p>待审批的项目申请数:{{work.projectsRecords}}</p>
              <p>待审批的资金申请数:{{work.fundsRecords}}</p>
              <p>逾期待处理项目数量:{{work.projectsOverTime}}</p>
            </ul>
          </div>
        </el-card>
        </el-col>
        <el-col :span="12">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>资金统计</span>
            </div>
          </template>
          <div class="card-content">
            <p>总资金:{{fundsManager.totalFunds}}</p>
            <p>已使用资金:{{fundsManager.totalFunds-fundsManager.totalRemainingFunds}}</p>
            <p>剩余资金:{{fundsManager.totalRemainingFunds}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>项目统计</span>
            </div>
          </template>
          <div class="card-content">
            <p>项目总数：{{projectManager.projects}}</p>
            <p>已逾期项目:{{projectManager.projectsOf2}}</p>
            <p>进行中项目:{{projectManager.projectsOf3}}</p>
            <p>已完成项目:{{projectManager.projectsOf4}}</p>
            <p>已废弃项目:{{projectManager.projectsOf5}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-card {
  height: 330px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.card-content {
  font-size: 14px;
  line-height: 2;
}

.card-content ul {
  padding-left: 20px;
}

.card-content li {
  margin-bottom: 5px;
}
</style>