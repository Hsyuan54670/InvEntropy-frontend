<script setup>
import * as echarts from 'echarts';
import { onMounted, ref , onBeforeUnmount } from 'vue'
import { getUserInfoApi,getUserIngProjectsApi } from '@/api/home'
import { watch, nextTick } from 'vue'
const user = ref({
    name: '',
    age: 0,
    gender:'',
    college: '',
    passedProjects: 0,
    ingProjects: 0,
    phone: '',
    finishedProjects: 0,
})
const initUserInfo =async() => {
    const res = await getUserInfoApi()
    if(res.code === 200) {
        user.value = res.data
    }
}
const ingProjectsList = ref([])

const initIngProjectsList = async() => {
    const res = await getUserIngProjectsApi()
    if(res.code === 200) {
        ingProjectsList.value = res.data
        ingProjectsList.value.forEach(project => {project.deadline = project.deadline.replace('T',' ')})
        QueryTimeList()
    }
}
const timeList = ref([])
const myChart =ref()
// 监听 timeList 变化
watch(() => timeList.value.length, (newLength) => {
    if (newLength > 0) {
        // 确保 DOM 已经更新
        nextTick(() => {
            if (!myChart.value) {
                initChart()
            } else {
                uploadChart()
            }
        })
    }
}, { immediate: true })


const initChart = () =>{
    const chartDom = document.getElementById('myChart');
    if(!chartDom) return
    myChart.value = echarts.init(chartDom);
    const option = {
        title: {
            text: '项目进度',
            left: 'center',
            textStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}天'
        },
        legend: {
            top: '7%',
            left: 'center',
        },
        series: [
            {
                name: '剩余时间',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                  },
                  label: {
                    show: true,
                    formatter: '{b}: {d}%'
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 16,
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: true
                  },
                  data: timeList.value
            }
        ]
        
    }
    myChart.value.setOption(option);
}
const uploadChart = () => {
    if (myChart.value) {
        const option = {
            series: [
                {
                    data: timeList.value
                }
            ]
        }
        myChart.value.setOption(option);
    }
}
const QueryTimeList = () => {
    for (let i = 0; i < ingProjectsList.value.length; i++) {
        // 转换为天数
        const daysLeft = Math.ceil((new Date(ingProjectsList.value[i].deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        timeList.value.push({value: daysLeft, name: ingProjectsList.value[i].projectName})
    }
    if(myChart.value)
        uploadChart()
    else
        initChart()
}
// 处理窗口大小变化
const handleResize = () => {
  if (myChart.value) {
    myChart.value.resize();
  }
};


onMounted(() => {
    // 监听窗口大小变化，使图表自适应
    window.addEventListener('resize', handleResize);
    // 获取用户信息
    initUserInfo()
    initIngProjectsList()
    
})
onBeforeUnmount(() => {
  if (myChart.value) {
    myChart.value.dispose();
  }
  // 移除窗口大小变化的监听
  window.removeEventListener('resize', handleResize);
});



</script>

<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-card class="user-info-card">
                <template #header>
                    <div class="card-header">
                        <span>个人信息</span>
                    </div>
                </template>
                <div class="info-content">
                    <p><i class="el-icon-user"></i> 姓名：{{ user.name }}</p>
                    <p><i class="el-icon-male" v-if="user.gender === 'M'"></i>
                       <i class="el-icon-female" v-else-if="user.gender === 'F'"></i>
                       <i class="el-icon-help" v-else></i> 性别：{{ user.gender === 'M' ? '男' : user.gender === 'F' ? '女' : '未知' }}</p>
                    <p><i class="el-icon-school"></i> 学院：{{ user.college }}</p>
                    <p><i class="el-icon-phone"></i> 电话：{{ user.phone }}</p>
                    <p><i class="el-icon-timer"></i> 年龄：{{ user.age }}</p>
                </div>
            </el-card>

            <el-card class="stats-card">
                <template #header>
                    <div class="card-header">
                        <span>项目统计</span>
                    </div>
                </template>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">{{ user.ingProjects }}</div>
                        <div class="stat-label">进行中</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ user.finishedProjects }}</div>
                        <div class="stat-label">已完成</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ user.passedProjects }}</div>
                        <div class="stat-label">已通过</div>
                    </div>
                </div>
            </el-card>
        </el-col>

        <el-col :span="8">
            <el-card class="projects-card">
                <template #header>
                    <div class="card-header">
                        <span>进行中的项目</span>
                    </div>
                </template>
                <div v-if="ingProjectsList.length > 0">
                    <div 
                        v-for="project in ingProjectsList" 
                        :key="project.id" 
                        class="project-item"
                    >
                        <h4>{{ project.projectName }}</h4>
                        <div class="project-details">
                            <div class="detail-item">
                                <span class="label">经费：</span>
                                <span class="value">{{ project.funds }} RMB</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">截止：</span>
                                <span class="value">{{ project.deadline }}</span>
                            </div>
                        </div>
                        <el-progress 
                            :percentage="Math.max(0, Math.round((Date.now()-new Date(project.startTime).getTime())/(new Date(project.deadline).getTime()-new Date(project.startTime).getTime())* 100) )" 
                            :color="project.funds > 50000 ? '#67C23A' : project.funds > 10000 ? '#E6A23C' : '#F56C6C'"
                        />
                    </div>
                </div>
                <div v-else class="no-projects">
                    <el-empty description="暂无进行中的项目" />
                </div>
            </el-card>
        </el-col>

        <el-col :span="8">
            <el-card class="chart-card">
                <template #header>
                    <div class="card-header">
                        <span>项目进度</span>
                    </div>
                </template>
                <div id="myChart" style="height: 680px;" v-if="timeList.length>0"></div>
                <div v-else class="no-chart">
                    <el-empty description="暂无数据" />
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped>
.card-header {
    font-weight: 600;
    font-size: 16px;
    color: #303133;
}

.info-content p {
    margin: 12px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
}

.info-content i {
    margin-right: 8px;
    width: 16px;
    color: #409EFF;
}

.stats-grid {
    display: flex;
    justify-content: space-between;
}

.stat-item {
    text-align: center;
    padding: 10px;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    color: #909399;
}

.project-item {
    padding: 16px 0;
    border-bottom: 1px solid #eee;
}

.project-item:last-child {
    border-bottom: none;
}

.project-item h4 {
    margin: 0 0 12px;
    font-size: 16px;
    color: #303133;
}

.project-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
}

.label {
    color: #909399;
}

.value {
    color: #303133;
    font-weight: 500;
}

.no-projects {
    text-align: center;
    padding: 40px 0;
}

.no-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
}

.user-info-card {
    margin-bottom: 20px;
}

.projects-card, .chart-card {
    height: 100%;
    overflow-y: auto;
}
</style>