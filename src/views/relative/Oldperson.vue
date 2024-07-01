<template>
  <div>
    <a-card>
      <a-form layout="inline" style="display: flex;justify-content: space-between;">
        <a-form-item label="筛选查询:">
          <a-input v-model:value="search" placeholder="请输入老人信息" />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px;" type="primary" @click="searchElderly">查询搜索</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between">
        <span style="font-size: 16px; font-weight: 700;">老人信息列表</span>
        <a-button type="primary" style="margin-right: 16px" @click="showAddModal">新增数据</a-button>
      </div>
    </a-card>
    <a-table :columns="columns" :dataSource="data" rowKey="id" style="margin: 6px;">
      <template v-slot:bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="link" danger @click="deleteElderly(record.id)">删除</a-button>
        </span>
        <a-tag v-else-if="column.key === 'health_state'" :color="getHealthTagColor(record.health_state)">
          {{ getHealthTagText(record.health_state) }}
        </a-tag>
        <span v-else-if="column.key === 'birthday' || column.key === 'checkin_date'">
          {{ formatDate(record[column.key]) }}
        </span>
        <span v-else-if="column.key === 'gender'">
          {{ formatGender(record.gender) }}
        </span>
        <span v-else>
          {{ record[column.key] }}
        </span>
      </template>
    </a-table>

    <a-modal v-model:open="isModalVisible" :title="modalTitle" @ok="handleOk" @cancel="handleCancel">
      <a-form :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-form-item label="姓名">
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="form.gender">
            <a-select-option value="male">男</a-select-option>
            <a-select-option value="female">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="form.phone" />
        </a-form-item>
        <a-form-item label="房间号">
          <a-input v-model:value="form.room_number" />
        </a-form-item>
        <a-form-item v-if="modalTitle === '新增老人信息'" label="入园日期">
          <a-date-picker v-model:value="form.checkin_date" show-time />
        </a-form-item>
        <a-form-item v-if="modalTitle === '新增老人信息'" label="出园日期">
          <a-date-picker v-model:value="form.checkout_date" show-time />
        </a-form-item>
        <a-form-item v-if="modalTitle === '新增老人信息'" label="出生日期">
          <a-date-picker v-model:value="form.birthday" show-time />
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input v-model:value="form.id_card" />
        </a-form-item>
        <a-form-item label="监护人姓名">
          <a-input v-model:value="form.firstguardian_name" />
        </a-form-item>
        <a-form-item label="监护人关系">
          <a-input v-model:value="form.firstguardian_relationship" />
        </a-form-item>
        <a-form-item label="监护人电话">
          <a-input v-model:value="form.firstguardian_phone" />
        </a-form-item>
        <a-form-item label="监护人微信">
          <a-input v-model:value="form.firstguardian_wechat" />
        </a-form-item>
        <a-form-item label="健康状况">
          <a-select v-model:value="form.health_state">
            <a-select-option value="healthy">健康</a-select-option>
            <a-select-option value="sub-health">亚健康</a-select-option>
            <a-select-option value="ill">患病</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model:value="form.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '../../stores/userStore';
import { getOldPersons, deleteOldPerson, addOldPerson, updateOldPerson } from '../../services/oldPersonService';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn.js';
dayjs.locale('zh-cn');


const userStore = useUserStore();

const search = ref('');
const data = ref([]);
const isModalVisible = ref(false);
const modalTitle = ref('新增老人信息');
const form = reactive({
  id: 0,
  username: '',
  gender: '',
  phone: '',
  id_card: '',
  birthday: '',
  checkin_date: '',
  checkout_date: '',
  imgset_dir: '',
  profile_photo: '',
  room_number: '',
  firstguardian_name: '',
  firstguardian_relationship: '',
  firstguardian_phone: '',
  firstguardian_wechat: '',
  health_state: '',
  description: '',
  isactive: '1',
  created: '',
  created_by: 0,
  updated: '',
  updated_by: 0,
  remove: '0'
});
const finalForm = reactive({
  id: 0,
  username: '',
  gender: '',
  phone: '',
  id_card: '',
  birthday: '',
  checkin_date: '',
  checkout_date: '',
  imgset_dir: '',
  profile_photo: '',
  room_number: '',
  firstguardian_name: '',
  firstguardian_relationship: '',
  firstguardian_phone: '',
  firstguardian_wechat: '',
  health_state: '',
  description: '',
  isactive: '1',
  created: '',
  created_by: 0,
  updated: '',
  updated_by: 0,
  remove: '0'
});

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '姓名', dataIndex: 'username', key: 'username' },
  { title: '性别', dataIndex: 'gender', key: 'gender' },
  { title: '房间号', dataIndex: 'room_number', key: 'room_number' },
  { title: '入园日期', dataIndex: 'checkin_date', key: 'checkin_date' },
  { title: '出生日期', dataIndex: 'birthday', key: 'birthday' },
  { title: '身份证号', dataIndex: 'id_card', key: 'id_card' },
  { title: '健康状况', dataIndex: 'health_state', key: 'health_state' },
  { title: '操作', key: 'action' }
];

const getHealthTagColor = (healthState: string) => {
  if (healthState === 'healthy') return 'green';
  if (healthState === 'sub-health') return 'yellow';
  return 'red';
};

const getHealthTagText = (healthState: string) => {
  if (healthState === 'healthy') return '健康';
  if (healthState === 'sub-health') return '亚健康';
  return '患病';
};

const formatDate = (date: string) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    console.error("Invalid date encountered:", date);
    return '时间不合法';
  }
  return parsedDate.format('YYYY-MM-DD');
};

const formatGender = (gender: string) => {
  return gender === 'male' ? '男' : '女';
};

const searchElderly = () => {
  message.info('搜索功能未实现');
};

const resetSearch = () => {
  search.value = '';
  fetchData();
  message.success('搜索条件已重置');
};

const showAddModal = () => {
  console.log("showAddModal called");
  modalTitle.value = '新增老人信息';
  Object.assign(form, {
    id: 0,
    username: '',
    gender: '',
    phone: '',
    id_card: '',
    birthday: '',
    checkin_date: '',
    checkout_date: '',
    imgset_dir: '',
    profile_photo: '',
    room_number: '',
    firstguardian_name: '',
    firstguardian_relationship: '',
    firstguardian_phone: '',
    firstguardian_wechat: '',
    health_state: '',
    description: '',
    isactive: '1',
    created: '',
    created_by: 0,
    updated: '',
    updated_by: 0,
    remove: '0'
  });
  isModalVisible.value = true;
};

const showEditModal = (record: any) => {
  modalTitle.value = '编辑老人信息';
  try {
    Object.assign(form, {
      ...record,
      /* birthday: record.birthday ? dayjs(record.birthday).format('YYYY-MM-DD HH:mm:ss') : '',
      checkin_date: record.checkin_date ? dayjs(record.checkin_date).format('YYYY-MM-DD HH:mm:ss') : '',
      checkout_date: record.checkout_date ? dayjs(record.checkout_date).format('YYYY-MM-DD HH:mm:ss') : '', */
    });
    console.log('Form data prepared for edit:', form);
  } catch (error) {
    console.error('Error preparing form data:', error);
    message.error('日期处理出错，请检查数据格式！');
  }
  isModalVisible.value = true;
};

const handleOk = async () => {
  try {
    console.log("handleOk", form);
    Object.assign(finalForm, form);

    if (dayjs(finalForm.birthday).isValid()) {
      finalForm.birthday = dayjs(finalForm.birthday).format('YYYY-MM-DD HH:mm:ss');
    }
    if (dayjs(finalForm.checkin_date).isValid()) {
      finalForm.checkin_date = dayjs(finalForm.checkin_date).format('YYYY-MM-DD HH:mm:ss');
    }
    if (dayjs(finalForm.checkout_date).isValid()) {
      finalForm.checkout_date = dayjs(finalForm.checkout_date).format('YYYY-MM-DD HH:mm:ss');
    }
    finalForm.updated = dayjs().format('YYYY-MM-DD HH:mm:ss');
    finalForm.updated_by = userStore.userInfo.id;

    if (modalTitle.value === '新增老人信息') {
      finalForm.created = finalForm.updated;
      finalForm.created_by = userStore.userInfo.id;
      await addOldPerson(finalForm);
      message.success('新增成功');
    } else if (finalForm.id != null) {
      await updateOldPerson(finalForm.id, finalForm);
      message.success('更新成功');
    } else {
      console.error("Attempted to update a record without an ID.");
      message.error('无法更新，因为没有有效的 ID。');
    }
    fetchData();
    isModalVisible.value = false;
  } catch (error) {
    message.error('操作失败');
    console.log(error);
  }
};


const handleCancel = () => {
  isModalVisible.value = false;
};

const deleteElderly = async (id: number) => {
  try {
    await deleteOldPerson(id);
    message.success('删除成功');
    fetchData();
  } catch (error) {
    message.error('删除失败');
    console.log(error);
  }
};

// 获取老人信息数据
const fetchData = async () => {
  try {
    const result = await getOldPersons();
    data.value = result;
  } catch (error) {
    message.error('获取老人信息失败');
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* styles */
</style>
