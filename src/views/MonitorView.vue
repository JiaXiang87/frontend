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

    <a-modal v-model:visible="modalVisible" :title="`监控 - ${currentRecord?.id}`" @ok="handleOk" @cancel="handleCancel">
      <video ref="videoRef" controls style="width: 100%">
        Your browser does not support the video tag.
      </video>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import Hls from 'hls.js';

interface Record {
  id: number;
  status: string;
  url: string;
}

const data = ref([
  { id: 1, status: '运行中', url: 'http://119.3.183.185/hls/stream.m3u8' },
  { id: 2, status: '已停止', url: 'http://119.3.183.185/hls/stream.m3u8' }
]);

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '运行状态', dataIndex: 'status', key: 'status' },
  { title: '查看', key: 'action' }
];

const modalVisible = ref(false);
const currentRecord = ref<Record | null>(null);
const videoRef = ref(null);

const showModal = (record: Record) => {
  currentRecord.value = record;
  modalVisible.value = true;
  loadVideo(record.url);
};

const loadVideo = (url: string) => {
  if (Hls.isSupported()) {
    const video = videoRef.value;
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
};

const handleOk = () => {
  modalVisible.value = false;
  message.success('视频播放结束');
};

const handleCancel = () => {
  modalVisible.value = false;
  message.info('关闭视频播放');
};

onMounted(() => {
  // 逻辑代码...
});

onUnmounted(() => {
  // 清理代码...
});
</script>
