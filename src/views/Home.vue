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
            text: '项目计划图',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: '100px',
            left: 'center',
        },
        series: [
            {
                name: '剩余时间',
                type: 'pie',
                data: ['40%','70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                  },
                  label: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 40,
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: false,
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
        timeList.value.push({value:new Date(ingProjectsList.value[i].deadline).getTime() - Date.now(),name:ingProjectsList.value[i].projectName})
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
    <el-row gutter="10">
        <el-col :span="10">
            
                <div class="user-info" >
        <el-card >
            <div class="card-content">
                <p>姓名：{{ user.name }}</p>
                <p>年龄：{{ user.age }}</p>
                <p>性别：{{ user.gender === 'M' ? '男' : user.gender === 'F' ? '女' : '未知' }}</p>
                <p>所属学院：{{ user.college }}</p>
                <p>电话号码：{{ user.phone }}</p>
                <p>进行中的项目数量：{{ user.ingProjects }}</p>
                <p>已完成项目数量：{{ user.finishedProjects }}</p>
                <p>已通过项目数量：{{ user.passedProjects }}</p>
            </div>
        </el-card>
                </div>
            
            
                <div class="ing-projects" >
        <el-card style="height: 445px;">
            <div class="card-content">
                <h1 align="center" style="margin-bottom:30px;">进行中的项目</h1>
                <div class="carousel-container">
                    <el-carousel
                        height="220px"
                        :autoplay="true"
                        :interval="3000"
                        motion-blur
                    >
                        <el-carousel-item v-for="project in ingProjectsList" :key="project.id" >
                            <div class="carousel-item">
                                <p>项目名称：{{ project.projectName }}</p>
                                <p>经费剩余：{{ project.funds }} RMB</p>
                                <p>截止时间：{{ project.deadline }}</p>
                            </div>
                            <el-countdown
                                :value="new Date(project.deadline).getTime()"
                                format="HH:mm:ss"
                                :auto-start="false"
                                prefix="剩余时间："
                                align="center"
                            />
                        </el-carousel-item>
                        
                    </el-carousel>
                    
                </div>
            
            </div>
        </el-card>
                </div>
        </el-col>

        <el-col :span="14">
            <div class="report-projects">
                <el-card style="height: 835px;">
                    <div class="card-content">
                        <div id="myChart" style="height: 700px;" v-if="timeList.length>0"></div>
                        <div v-else>
                            <el-empty description="暂无进行中的项目" />
                        </div>
                    </div>
                </el-card>
            </div>
        </el-col>
    </el-row>
    

</template>

<style scoped>
.user-info {
    margin-bottom: 20px;
}
.ing-projects {
    margin-top: 20px;
}
.carousel-item {
    background-color: rgb(72, 96, 106);
    color: #fff;
    padding: 20px;
    border-radius: 10px;
}

</style> 