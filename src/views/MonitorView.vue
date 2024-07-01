<template>
  <div>
    <a-table :columns="columns" :dataSource="data" rowKey="id">
      <template #bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="showModal(record)">查看</a-button>
        </span>
        <span v-else>
          {{ record[column.key] }}
        </span>
      </template>
    </a-table>

    <a-modal 
      v-model:visible="modalVisible"
      :title="`监控 - ${currentRecord?.id}`"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <video controls autoplay :src="currentRecord?.url"></video>
    </a-modal>
  </div>
</template>



<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

interface Record {
  id: number;
  status: string;
  url: string;
}

const data = ref([
  { id: 1, status: '运行中', url: 'rtsp://47.93.76.253:8554/camera_test' },
  { id: 2, status: '已停止', url: 'rtsp://47.93.76.253:8554/camera_test'}
]);

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '运行状态', dataIndex: 'status', key: 'status' },
  { title: '查看', key: 'action' }
];

const modalVisible = ref(false);
const currentRecord = ref<Record | null>(null);

const showModal = (record: Record) => {
  currentRecord.value = record;
  modalVisible.value = true;
};

const handleOk = () => {
  modalVisible.value = false;
  message.success('视频播放结束');
};

const handleCancel = () => {
  modalVisible.value = false;
  message.info('关闭视频播放');
};
</script>
