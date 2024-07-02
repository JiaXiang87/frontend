<template>
  <div>
    <a-card>
      <a-form layout="inline" style="display: flex; justify-content: space-between;">
        <a-form-item label="筛选查询:">
          <a-input v-model:value="search" placeholder="请输入义工信息" />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px;" type="primary" @click="searchVolunteers">查询搜索</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between">
        <span style="font-size: 16px; font-weight: 700;">义工信息列表</span>
        <a-button type="primary" style="margin-right: 16px" @click="showAddModal">新增数据</a-button>
      </div>
    </a-card>
    <a-table :columns="columns" :dataSource="data" rowKey="id" style="margin: 6px;">
      <template v-slot:bodyCell="{ column, record }">
        <span v-if="column.key === 'action'">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="link" danger @click="handleDelete(record.id)">删除</a-button>
        </span>
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
          <a-input v-model:value="form.name" />
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
        <a-form-item label="身份证号">
          <a-input v-model:value="form.id_card" />
        </a-form-item>
        <a-form-item v-if="modalTitle === '新增义工'" label="入园日期">
          <a-date-picker v-model:value="form.checkin_date" show-time />
        </a-form-item>
        <a-form-item v-if="modalTitle === '新增义工'" label="出园日期">
          <a-date-picker v-model:value="form.checkout_date" show-time />
        </a-form-item>
        <a-form-item v-if="modalTitle === '新增义工'" label="出生日期">
          <a-date-picker v-model:value="form.birthday" show-time />
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
import { getVolunteers, deleteVolunteer, addVolunteer, updateVolunteer } from '../../services/volunteerService';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const userStore = useUserStore();

const search = ref('');
const data = ref([]);
const isModalVisible = ref(false);
const modalTitle = ref('新增义工');
const form = reactive({
  id: 0,
  org_id: 0,
  client_id: 0,
  name: '',
  gender: '',
  phone: '',
  id_card: '',
  birthday: '',
  checkin_date: '',
  checkout_date: '',
  imgset_dir: '',
  profile_photo: '',
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
  org_id: 0,
  client_id: 0,
  name: '',
  gender: '',
  phone: '',
  id_card: '',
  birthday: '',
  checkin_date: '',
  checkout_date: '',
  imgset_dir: '',
  profile_photo: '',
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
  { title: '姓名', dataIndex: 'username', key: 'name' },
  { title: '性别', dataIndex: 'gender', key: 'gender' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  { title: '入园日期', dataIndex: 'checkin_date', key: 'checkin_date' },
  { title: '身份证号', dataIndex: 'id_card', key: 'id_card' },
  { title: '操作', key: 'action' }
];

const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD');
const formatGender = (gender: string) => gender === 'male' ? '男' : '女';

const searchVolunteers = () => {
  message.info('搜索功能未实现');
};

const resetSearch = () => {
  search.value = '';
  fetchData();
  message.success('搜索条件已重置');
};

const showAddModal = () => {
  modalTitle.value = '新增义工';
  Object.assign(form, {
    id: 0,
    org_id: 0,
    client_id: 0,
    name: '',
    gender: '',
    phone: '',
    id_card: '',
    birthday: '',
    checkin_date: '',
    checkout_date: '',
    imgset_dir: '',
    profile_photo: '',
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
  modalTitle.value = '编辑义工信息';
  Object.assign(form, record);
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
    if (modalTitle.value === '新增义工') {
      finalForm.created = finalForm.updated;
      finalForm.created_by = userStore.userInfo.id;
      await addVolunteer(finalForm);
      message.success('新增成功');
    } else {
      await updateVolunteer(finalForm.id, finalForm);
      message.success('更新成功');
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

const handleDelete = async (id: number) => {
  try {
    await deleteVolunteer(id);
    message.success('删除成功');
    fetchData();
  } catch (error) {
    message.error('删除失败');
    console.log(error);
  }
};

const fetchData = async () => {
  try {
    const result = await getVolunteers();
    data.value = result;
  } catch (error) {
    message.error('获取义工信息失败');
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* styles */
</style>
