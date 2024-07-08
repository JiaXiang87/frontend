<template>
  <a-layout>
    <a-layout-content style="padding: 24px; background: #fff; min-height: 280px;">
      <a-card title="管理员信息">
        <img class="avatar" src="../assets/avatar.jpg" alt="">
        <a-descriptions bordered>
          <a-descriptions-item label="昵称" :span="3">{{ userInfo.username }}</a-descriptions-item>
          <a-descriptions-item label="姓名" :span="3">{{ userInfo.realName }}</a-descriptions-item>
          <a-descriptions-item label="性别" :span="3">{{formattedSex(userInfo.sex) }}</a-descriptions-item>
          <a-descriptions-item label="电话" :span="3">{{ userInfo.phone }}</a-descriptions-item>
          <a-descriptions-item label="邮箱" :span="3">{{ userInfo.email }}</a-descriptions-item>
          <a-descriptions-item label="描述" :span="3">{{ userInfo.description }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';

const userInfo = reactive({
  id: 0,
  username: '',
  realName: '',
  sex: '',
  description: '',
  phone: '',
  email: '',
});

const formattedSex = (sex:string)=>{
  return sex === 'male' ? '男' : '女'
}

const fetchAdminInfo = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await fetch('http://47.102.213.168:8080/admin/info', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    Object.assign(userInfo, {
      id: data.id,
      username: data.username,
      realName: data.real_name,
      sex: data.sex,
      description: data.description,
      phone: data.phone,
      email: data.email,
    });
  }
}

onMounted(() => {
  fetchAdminInfo();
})
</script>

<style scoped>

.avatar{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;  
  margin: 10px auto;
}
</style>
