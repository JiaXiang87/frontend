<template>
  <h1>欢迎登录智慧养老系统</h1>
  <a-card>
    <div class="greet">
      <img v-if="userStore.token" src="../assets/avatar.jpg" alt="">
      <img v-else src="" alt="">
      <span class="greetText">
      {{ greetingMessage1 }}{{ userName }}{{ greetingMessage2 }}
      </span>
    </div>
  </a-card>
  <a-card title="人员数量统计">
    <a-descriptions bordered>
      <a-descriptions-item label="老人" >{{ personData.elderly_count }}</a-descriptions-item>
      <a-descriptions-item label="工作人员" >{{ personData.employee_count }}</a-descriptions-item>
      <a-descriptions-item label="义工" >{{ personData.employee_count }}</a-descriptions-item>
      </a-descriptions>
  </a-card>
  <a-card title="任务数量统计">
    <a-descriptions bordered>
      <a-descriptions-item label="运行中" >{{ eventData.run_count }}</a-descriptions-item>
      <a-descriptions-item label="等待中" >{{ eventData.pend_count }}</a-descriptions-item>
      <a-descriptions-item label="已完成" >{{ eventData.finish_count }}</a-descriptions-item>
      </a-descriptions>
  </a-card>
  <a-card title="监控数量统计">
    <a-descriptions bordered>
      <a-descriptions-item label="运行中" >{{ monitorData.alive_count }}</a-descriptions-item>
      <a-descriptions-item label="已停用" >{{ monitorData.dead_count }}</a-descriptions-item>
      <a-descriptions-item label="故障中" >{{ monitorData.rest_count }}</a-descriptions-item>
      </a-descriptions>
  </a-card>
</template>

<script lang='ts' setup>
import { ref, onMounted, computed, reactive } from 'vue';
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


onMounted(() => {
  updateGreeting();
  fetchData();
});
</script>

<style scoped>

.greet img{
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.greet .greetText{
  margin-left: 20px;
  font-size: 20px;
}
</style>
