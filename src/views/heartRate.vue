<template>
 <a-card style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between">
        <span style="font-size: 16px; font-weight: 700;">老人心率列表</span>
      </div>
    </a-card>
    <a-table :columns="columns" :dataSource="data" rowKey="id" style="margin: 6px;">
      <template v-slot:bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="">查看</a-button>
          <a-divider type="vertical" />
          <!-- <a-button type="link" danger @click="deleteElderly(record.id)">删除</a-button> -->
        </span>
        <a-tag v-else-if="column.key === 'health_state'" :color="getHealthTagColor(record.heart_rate)">
          {{ getHealthTagText(record.heart_rate) }}
        </a-tag>
        <span v-else>
          {{ record[column.key] }}
        </span>
      </template>
    </a-table>
</template>

<script lang='ts' setup>
import{ref,reactive,onMounted} from 'vue'
import Oldperson from './relative/Oldperson.vue';

interface Heart {
  id: number,
  oldperson_id: number,
  heart_rate: number,
  timestamp: string,
}

const data = ref<Heart[]>([]);
const form = reactive({
  id: 0,
  oldperson_id: 0,
  heart_rate: 0,
  timestamp: "",
});

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '对应老人', dataIndex: 'oldperson_id', key: 'oldperson_id' },
  { title: '心率', dataIndex: 'heart_rate', key: 'heart_rate' },
  { title: '健康状况', key: 'health_state' },
  { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
  { title: '操作', key: 'action' }
];

const getHealthTagColor = (heartRate: number) => {
  return heartRate < 100 ? 'green' : 'yellow'
};

const getHealthTagText = (heartRate: number) => {
   return heartRate < 100 ? '正常' : '异常'
};

const generateFakeData = () => {
  const sampleData = [];
  for (let i = 1; i <= 10; i++) {
    sampleData.push({
      id: i,
      oldperson_id: 1000 + i,
      heart_rate: Math.floor(Math.random() * (120 - 60) + 60), // 随机生成60到120之间的心率
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  }
  data.value = sampleData;
};

onMounted(() => {
  generateFakeData();
});

</script>

<style scoped>

</style>