<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">用户登录</div>
      <div class="form-wrapper">
        <input type="text" v-model="username"  placeholder="请输入用户名"  class="input-item">
        <input type="password" v-model="password"  placeholder="请输入密码"  class="input-item">
        <input type="submit" id="login" class="btn" value="登录" @click="login">
      </div>
      <div class="msg">
        没有账号？ <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
  </template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { apiLogin } from '../services/authService';

const username = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const login = async () => {
  try {
    const response = await apiLogin(username.value, password.value);
    console.log('登录成功', response);
    // 更新 Pinia store 中的用户信息和 token
    userStore.userLogin(
      {
        id: response.id, // 确保 id 为数字类型
        username: response.username,
        realName: response.realName,
        email: response.email,
      },
      response.token
    );
    // 将 token 存储在本地存储中
    localStorage.setItem('token', response.token);
    // 跳转到主页或其他页面
    router.push('/');
  } catch (error) {
    console.error('登录失败', error);
    alert('登录失败，请检查用户名和密码');
  }
};
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to right, #c2dffb, #a8a6ee);
  }
  
  .login-wrapper {
    width: 300px;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-30px);
  }
  
  .header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-wrapper {
    margin-bottom: 20px;
  }
  
  .input-item {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .msg {
    text-align: center;
  }
  
  .msg a {
    color: #007bff;
    text-decoration: none;
  }
  
  .msg a:hover {
    text-decoration: underline;
  }
  </style>
  