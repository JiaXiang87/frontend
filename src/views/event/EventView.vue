<template>
  <div>
    <a-card>
      <a-form layout="inline" style="display: flex;justify-content: space-between;">
        <a-form-item label="筛选查询:">
          <a-input v-model:value="search" placeholder="请输入事件信息" />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px;" type="primary" @click="handleSearch">查询搜索</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between">
        <span style="font-size: 16px; font-weight: 700;">事件列表</span>
      </div>
    </a-card>
    <a-table :columns="columns" :dataSource="events" rowKey="id" style="margin: 6px;">
      <template #bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="viewDetails(record)">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="link" danger @click="handleDelete(record.id)">删除</a-button>
        </span>
        <span v-else-if="column.key === 'event_type'">
          {{ eventTypeText(record.event_type) }}
        </span>
        <span v-else-if="column.key === 'oldperson_id'">
          {{ formatOldPersonId(record.oldperson_id) }}
        </span>
        <span v-else>
          {{ record[column.key] }}
        </span>
      </template>
    </a-table>

    <a-modal 
      v-model:open="modalVisible"
      :title="`事件详情 - ${currentRecord?.event_desc}`"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <img :src="currentRecord?.image" alt="事件图片" style="width: 100%; max-height: 300px; object-fit: cover;"/>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getEvents, deleteEvent, searchEvents } from '../../services/eventService';

const search = ref('');
const events = ref([]);
const modalVisible = ref(false);
const currentRecord = ref({
  id: 0,
  event_type: 0,
  event_date: "",
  event_desc: "",
  oldperson_id: 0,
  event_location: "",
  image: '',
});

const eventTypeText = (type: number): string => {
  const types = {
    1: '情感检测',
    2: '入侵检测',
    3: '陌生人检测',
    4: '义工交互'
  } as { [key: number]: string };
  return types[type] || '未知类型';
};

const formatOldPersonId = (id: number) => {
  return id === 0 ? '无' : id.toString();
};

const columns = reactive([
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '事件类型', dataIndex: 'event_type', key: 'event_type' },
  { title: '日期', dataIndex: 'event_date', key: 'event_date' },
  { title: '地点', dataIndex: 'event_location', key: 'event_location' },
  { title: '相关老人', dataIndex: 'oldperson_id', key: 'oldperson_id' },
  { title: '操作', key: 'action' }
]);

const viewDetails = (record:any) => {
  currentRecord.value = record;
  modalVisible.value = true;
};

const handleSearch = async () => {
  try {
    const filteredEvents = await searchEvents(search.value);
    events.value = filteredEvents;
  } catch (error) {
    message.error('搜索事件失败');
  }
};

const resetSearch = () => {
  search.value = '';
  fetchEvents();
  message.success('搜索条件已重置');
};

const fetchEvents = async () => {
  try {
    const eventData = await getEvents();
    events.value = eventData;
  } catch (error) {
    message.error('获取事件数据失败');
  }
};

const handleDelete = async (id:number) => {
  try {
    await deleteEvent(id);
    fetchEvents();
    message.success('事件删除成功');
  } catch (error) {
    message.error('删除事件失败');
  }
};

const handleOk = () => {
  modalVisible.value = false;
};

const handleCancel = () => {
  modalVisible.value = false;
};

onMounted(fetchEvents);
</script>
