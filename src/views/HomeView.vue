<template>
  <h1>欢迎登录智慧养老系统</h1>
  <a-card>
    <div class="greet">
      <img v-if="userStore.token" src="../assets/avatar.jpg" alt="">
      <span class="greetText">{{ greetingMessage1 }}{{ userName }}{{ greetingMessage2 }}</span>
    </div>
  </a-card>
  <div class="dashboard" >
    <a-card class="bar-chart" title="人员数量统计">
      <div class="chart-container1" id="main-bar" style="height: 800px;"></div>
    </a-card>
    <div class="pie-charts">
      <a-card title="任务数量统计">
        <div class="chart-container2" id="task-pie" style="height: 400px;"></div>
      </a-card>
      <a-card title="监控数量统计">
        <div class="chart-container2" id="monitor-pie" style="height: 400px;"></div>
      </a-card>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, computed, reactive,nextTick } from 'vue';
import * as echarts from 'echarts';
import { useUserStore } from '../stores/userStore';
import {getOldPersonsCount} from '../services/oldPersonService'
import {getEmployeesCount} from '../services/employeeService'
import {getVolunteersCount} from '../services/volunteerService'
import {getStatusCount} from '../services/taskService'

const userStore = useUserStore();

const userName = computed(() => userStore.userInfo.realName);

const greetingMessage1 = ref('');
const greetingMessage2 = ref('');
const eventData = reactive({
   pend_count: 0,
   run_count: 0,
   finish_count: 0,
})

const personData = reactive({
   elderly_count: 0,
   employee_count: 0,
   volunteer_count: 0,
})

const monitorData = reactive({
   alive_count: 4,
   dead_count: 1,
   rest_count: 0,
})

const updateGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 11) {
    greetingMessage1.value = '早上好, ';
    greetingMessage2.value = ', 请开始一天的工作吧！';
  } else if (hours < 13) {
    greetingMessage1.value = '中午好, ';
    greetingMessage2.value = ', 午餐打算吃些什么？';
  } else if (hours < 18) {
    greetingMessage1.value = '下午好, ';
    greetingMessage2.value = ', 要喝杯咖啡提提精神吗？';
  } else {
    greetingMessage1.value = '晚上好, ';
    greetingMessage2.value = ', 记得早点休息不要工作太晚哦。';
  }
};

const fetchData = async ()=>{
   const elderly_count = await getOldPersonsCount();
   const employee_count = await getEmployeesCount();
   const volunteer_count = await getVolunteersCount();
   const tasks = await getStatusCount();
   console.log(tasks);
   Object.assign(personData,{
    elderly_count: elderly_count.count,
    employee_count: employee_count.count,
    volunteer_count: volunteer_count.count,
   });
   Object.assign(eventData,tasks);
}

const initBarChart = () => {
  const chartDom = document.getElementById('main-bar');
  const myChart = echarts.init(chartDom);
  const option = {
    xAxis: {
      type: 'category',
      data: ['老人', '工作人员', '义工']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [personData.elderly_count, personData.employee_count, personData.volunteer_count],
        type: 'bar'
      }
    ]
  };
  myChart.setOption(option);
};

const initPieChart = (containerId:string, data:any) => {
  const chartDom = document.getElementById(containerId);
  const myChart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
};

onMounted(() => {
  updateGreeting();
  fetchData().then(() => {
    nextTick(() => {
      initBarChart();
      initPieChart('task-pie', [
        { value: eventData.run_count, name: '运行中' },
        { value: eventData.pend_count, name: '等待中' },
        { value: eventData.finish_count, name: '已完成' }
      ]);
      initPieChart('monitor-pie', [
        { value: monitorData.alive_count, name: '运行中' },
        { value: monitorData.dead_count, name: '已停用' },
        { value: monitorData.rest_count, name: '故障中' }
      ]);
    });
  });
  });
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-wrap: nowrap; /* 防止内容换行 */
  justify-content: space-between;
  margin: 20px 0;
}

.bar-chart {
  flex: 1; /* 柱状图占用更多空间 */
  height: 400px; /* 设定固定高度确保对齐 */
}

.pie-charts {
  display: flex;
  flex-direction: column;
  flex: 1; /* 两个饼图共享剩余空间 */
  gap: 20px; /* 在两个饼图之间添加间隙 */
}

.chart-container1 {
  width: 100%; 
  height: 50%; 
}

.chart-container2 {
  width: 100%; /* 确保图表填充整个卡片容器 */
  height: 100%; /* 确保图表填充整个卡片容器 */
}

.greet img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.greet .greetText {
  margin-left: 20px;
  font-size: 20px;
}
</style>

