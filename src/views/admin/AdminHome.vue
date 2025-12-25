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
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="dashboard-card work-card">
          <template #header>
            <div class="card-header">
              <span>待处理工作</span>
            </div>
          </template>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ work.projectsRecords }}</div>
              <div class="stat-label">项目审批</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ work.fundsRecords }}</div>
              <div class="stat-label">资金审批</div>
            </div>
            <div class="stat-item overtime">
              <div class="stat-value">{{ work.projectsOverTime }}</div>
              <div class="stat-label">逾期项目</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="dashboard-card funds-card">
          <template #header>
            <div class="card-header">
              <span>资金统计</span>
            </div>
          </template>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">¥{{ fundsManager.totalFunds.toLocaleString() }}</div>
              <div class="stat-label">总资金</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥{{ (fundsManager.totalFunds - fundsManager.totalRemainingFunds).toLocaleString() }}</div>
              <div class="stat-label">已使用</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥{{ fundsManager.totalRemainingFunds.toLocaleString() }}</div>
              <div class="stat-label">剩余</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="dashboard-card projects-card">
          <template #header>
            <div class="card-header">
              <span>项目统计</span>
            </div>
          </template>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ projectManager.projects }}</div>
              <div class="stat-label">项目总数</div>
            </div>
            <div class="stat-item overdue">
              <div class="stat-value">{{ projectManager.projectsOf2 }}</div>
              <div class="stat-label">已逾期</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ projectManager.projectsOf3 }}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ projectManager.projectsOf4 }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ projectManager.projectsOf5 }}</div>
              <div class="stat-label">已废弃</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>项目状态分布</span>
            </div>
          </template>
          <div class="chart-container">
            <el-progress 
              :percentage="projectManager.projects ? Math.round((projectManager.projectsOf3 / projectManager.projects) * 100) : 0" 
              :color=" '#409EFF'"
              :stroke-width="20"
              status="success"
            >
              <span>进行中: {{ projectManager.projectsOf3 }}</span>
            </el-progress>
            <el-progress 
              :percentage="projectManager.projects ? Math.round((projectManager.projectsOf4 / projectManager.projects) * 100) : 0" 
              :color=" '#67C23A'"
              :stroke-width="20"
              status="success"
            >
              <span>已完成: {{ projectManager.projectsOf4 }}</span>
            </el-progress>
            <el-progress 
              :percentage="projectManager.projects ? Math.round((projectManager.projectsOf2 / projectManager.projects) * 100) : 0" 
              :color=" '#F56C6C'"
              :stroke-width="20"
              status="exception"
            >
              <span>已逾期: {{ projectManager.projectsOf2 }}</span>
            </el-progress>
            <el-progress 
              :percentage="projectManager.projects ? Math.round((projectManager.projectsOf5 / projectManager.projects) * 100) : 0" 
              :color=" '#909399'"
              :stroke-width="20"
            >
              <span>已废弃: {{ projectManager.projectsOf5 }}</span>
            </el-progress>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.dashboard-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
}

.card-header {
  font-weight: 600;
  font-size: 18px;
  color: #303133;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.stat-item.overtime, .stat-item.overdue {
  background-color: #fef0f0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.work-card {
  border-left: 4px solid #409EFF;
}

.funds-card {
  border-left: 4px solid #67C23A;
}

.projects-card {
  border-left: 4px solid #E6A23C;
}

.chart-container {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-container .el-progress {
  width: 100%;
}

.chart-container .el-progress span {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>