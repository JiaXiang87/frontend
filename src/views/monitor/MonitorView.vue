<template>
  <div>
    <a-table :columns="columns" :dataSource="data" rowKey="id">
      <template #bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="showModal(record)">查看</a-button>
        </span>
        <a-tag v-else-if="column.key === 'status'" :color="getStatusTagColor(record.status)">
          {{ getStatusTagText(record.status) }}
        </a-tag>
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import Hls from 'hls.js';
import { getAllVideoMonitors, createVideoMonitor, deleteVideoMonitor } from '../../services/monitorService';

interface Record {
  id: number;
  status: string;
  address: string;
  owner: string;
  url: string;
}

const data = ref([
]);

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '运行状态', dataIndex: 'status', key: 'status' },
  { title: '位置', dataIndex: 'address', key: 'address'},
  { title: '持有者', dataIndex: 'owner', key: 'owner'},
  { title: '查看', key: 'action' }
];

const modalVisible = ref(false);
const currentRecord = ref<Record | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const hlsInstance = ref<Hls | null>(null);

const getStatusTagColor = (status: string) => {
  if (status === 'alive') return 'green';
  if (status === 'dead') return 'red';
  return 'green';
};

const getStatusTagText = (status: string) => {
  if (status === 'alive') return '运行中';
  if (status === 'dead') return '已停用';
  return '故障中';
};

const loadVideo = (url: string) => {
  const video = videoRef.value;
  if (video) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsInstance.value = hls;  // 保存实例引用
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error('Error playing video:', e));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error('Error playing video:', e));
      });
    }
  }
};

// 显示模态窗口并加载视频
const showModal = (record: Record) => {
  if (record.status === 'dead') {
    message.warning(`监控 ${record.id} 已停用，无法查看。`);
  } else {
    currentRecord.value = record;
    modalVisible.value = true;
    if (record.url) {
      loadVideo(record.url);
    }
  }
};

const handleOk = () => {
  modalVisible.value = false;
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.currentTime = 0;
  }
  message.success('监控查看结束');
};

const handleCancel = () => {
  modalVisible.value = false;
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.currentTime = 0;
  }
  message.info('监控查看结束');
};

const loadData = async () => {
  try {
    const monitors = await getAllVideoMonitors();
    data.value = monitors;
  } catch (error) {
    message.error('加载视频监控数据失败');
  }
};

onMounted(() => {
  loadData();
});

// 清理视频流
onUnmounted(() => {
  if (hlsInstance.value) {
    hlsInstance.value.destroy();  // 销毁Hls实例
    hlsInstance.value = null;
  }
})
</script>
