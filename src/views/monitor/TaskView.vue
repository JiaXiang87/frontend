<template>
  <a-card>
    <a-form layout="inline" style="display: flex; justify-content: space-between;">
      <a-form-item label="筛选查询:">
        <a-input v-model:value="search" placeholder="请输入任务信息" />
      </a-form-item>
      <a-form-item>
        <a-button style="margin: 0 10px;" type="primary" @click="loadTasks">查询搜索</a-button>
        <a-button @click="resetSearch">重置</a-button>
      </a-form-item>
    </a-form>
  </a-card>
  <a-card style="margin-top: 20px;">
    <div style="display: flex; justify-content: space-between">
      <span style="font-size: 16px; font-weight: 700;">任务列表</span>
      <a-button type="primary" style="margin-right: 16px" @click="showAddModal">新增任务</a-button>
    </div>
    <a-table :columns="columns" :dataSource="tasks" rowKey="id">
      <template #bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="viewTask(record)">查看</a-button>
          <a-button type="link" danger @click="removeTask(record.id)">删除</a-button>
        </span>
        <span v-else-if="column.key === 'task_type'">
          {{ eventTypeText(record.task_type) }}
        </span>
        <a-tag v-else-if="column.key === 'status'" :color="getStatusTagColor(record.status)">
          {{ getStatusTagText(record.status) }}
        </a-tag>
        <span v-else>
          {{ record[column.key] }}
        </span>
      </template>
    </a-table>
  </a-card>
  <!-- Add Task Modal with Date Pickers -->
  <a-modal title="新增任务" v-model:visible="addModalVisible" @ok="submitNewTask" @cancel="cancelAddTask">
    <a-form model="newTask">
      <a-form-item label="任务类型">
        <a-select v-model:value="newTask.task_type">
          <a-select-option value="1">情感检测</a-select-option>
          <a-select-option value="2">入侵检测</a-select-option>
          <a-select-option value="3">陌生人检测</a-select-option>
          <a-select-option value="4">义工交互</a-select-option>
          <a-select-option value="5">摔倒检测</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="开始时间">
        <a-date-picker v-model:value="newTask.start_time" showTime format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker v-model:value="newTask.end_time" showTime format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model:value="newTask.status">
          <a-select-option value="run">进行中</a-select-option>
          <a-select-option value="pend">等待中</a-select-option>
          <a-select-option value="finish">已完成</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="对应监控ID">
        <a-input-number v-model:value="newTask.camera_id" style="width: 100%;" />
      </a-form-item>
    </a-form>
  </a-modal>

</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getAllTasks, createTask, updateTask, deleteTask } from '../../services/taskService';

interface Task {
  id: number;
  task_type: string;
  start_time: string;
  end_time: string;
  status: string;
  camera_id: number;
  url_string: string;
}

const search = ref('');
const tasks = ref<Task[]>([]);
const addModalVisible = ref(false);
const newTask = reactive({
  task_type: '',
  start_time: '',
  end_time: '',
  status:'',
  camera_id: 0
});

const columns = reactive([
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '任务类型', dataIndex: 'task_type', key: 'task_type' },
  { title: '开始时间', dataIndex: 'start_time', key: 'start_time' },
  { title: '结束时间', dataIndex: 'end_time', key: 'end_time' },
  { title: '运行状态', dataIndex: 'status', key: 'status' },
  { title: '对应监控', dataIndex: 'camera_id', key: 'camera_id' },
  { title: '操作', key: 'action' }
]);

const eventTypeText = (type: string): string => {
  const types = {
    '1': '情感检测',
    '2': '入侵检测',
    '3': '陌生人检测',
    '4': '义工交互',
    '5': '摔倒检测',
  } as { [key: string]: string };
  return types[type] || '未知类型';
};

const getStatusTagColor = (status: string) => {
  if (status === 'run') return 'green';
  if (status === 'pend') return 'yellow';
  return 'blue';
};

const getStatusTagText = (status: string) => {
  if (status === 'run') return '进行中';
  if (status === 'pend') return '等待中';
  return '已完成';
};

const loadTasks = async () => {
  try {
    const response = await getAllTasks();
    tasks.value = response;
  } catch (error) {
    message.error('加载任务数据失败');
  }
};

const removeTask = async (id: number) => {
  try {
    await deleteTask(id);
    message.success('任务删除成功');
    loadTasks();
  } catch (error) {
    message.error('删除任务失败');
  }
};

const viewTask = (task: Task) => {
  message.info(`查看任务 ${task.id}`);
};

const resetSearch = () => {
  search.value = '';
  loadTasks();
};


const showAddModal = () => {
  addModalVisible.value = true;
};

const cancelAddTask = () => {
  addModalVisible.value = false;
};

const submitNewTask = async () => {
  if (newTask.start_time && newTask.end_time) {
    const formattedTask = {
      ...newTask,
      start_time: dayjs(newTask.start_time).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dayjs(newTask.end_time).format('YYYY-MM-DD HH:mm:ss')
    };
    try {
      console.log(formattedTask);
      await createTask(formattedTask);
      message.success('任务创建成功');
      addModalVisible.value = false;
      loadTasks();  // 重新加载任务列表
    } catch (error) {
      message.error('创建任务失败');
    }
  } else {
    message.error('请完整填写任务时间');
  }
};

onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
/* styles */
</style>
