<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider collapsible v-model:collapsed="collapsed" @collapse="handleCollapse">
      <div v-if="!collapsed" class="logo" >智慧养老系统</div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[selectedKey]" @click="updateSelectedKey">
        <a-menu-item key="1">
          <router-link to="/">
            <home-outlined />
            <span>首页</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <user-outlined />
            <span>人员管理</span>
          </template>
          <a-menu-item key="2-1">
            <router-link to="/oldpersons">老人信息列表</router-link>
          </a-menu-item>
          <a-menu-item key="2-2">
            <router-link to="/employees">工作人员列表</router-link>
          </a-menu-item>
          <a-menu-item key="2-3">
            <router-link to="/volunteers">义工信息管理</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="3">
          <router-link to="/monitors">
            <insert-row-below-outlined />
            <span>监控管理</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <template #title>
            <exception-outlined />
            <span>事件管理</span>
          </template>
          <a-menu-item key="4-1">
            <router-link to="/events">事件列表</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="5">
          <router-link to="/aiChat">
            <robot-outlined />
            <span>智能语言聊天</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 头部 -->
      <a-layout-header style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px; background-color: #fff;">
        <!-- 路由显示部分 -->
        <a-breadcrumb :separator="'/'">
          <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            {{ breadcrumb }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 用户信息显示部分 -->
        <a-dropdown>
          <div class="user-info" style="display: flex; align-items: center; cursor: pointer;">
            <a-avatar :src="userAvatar" />
            <span style="margin-left: 8px;">{{ userName }}</span>
            <a-button v-if="!isLoggedIn" @click="goToLogin">登录</a-button>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link to="/account">管理员中心</router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/settings">管理员设置</router-link>
              </a-menu-item>
              <a-menu-item @click="logout">
                <logout-outlined/>
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>

      <!-- 主体内容 -->
      <a-layout-content style="margin: 24px 16px 0">
        <div style="padding: 24px; background: #fff; min-height: 400px">
          <router-view></router-view>
        </div>
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer style="text-align: center">
        智慧养老系统 ©2024 Created by pretty girls
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { UserOutlined,HomeOutlined,InsertRowBelowOutlined,ExceptionOutlined,RobotOutlined,LogoutOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore()

const collapsed = ref(false);
const handleCollapse = (collapse: boolean) => {
  collapsed.value = collapse;
};

const isLoggedIn = computed(() => {
  return userStore.token ? true : false
});
const userAvatar = computed(() => {
  const avatarUrl = "https://c-ssl.dtstatic.com/uploads/item/202004/04/20200404232342_cA5xn.thumb.400_0.jpeg";
  return avatarUrl;         
});
const userName = computed(() => isLoggedIn.value ? userStore.userInfo.realName : '未登录');

const route = useRoute();
const router = useRouter();
const selectedKey = ref('1');

const updateSelectedKey = (e: any) => {
  selectedKey.value = e.key;
};

// 面包屑数据
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(p => p);
  const breadcrumbsMap: { [key: string]: string} = {
    '': '首页',
    'oldpersons': '人员管理 / 老人信息列表',
    'employees': '人员管理 / 工作人员列表',
    'volunteers': '人员管理 / 义工信息管理',
    'monitors': '监控管理',
    'events': '事件管理/事件列表',
    'aiChat': '智能语言聊天'
  };

  return paths.map(path => breadcrumbsMap[path] || '未知页面');
});

function goToLogin() {
  router.push('/login');
}

function logout() {
  localStorage.removeItem('token');
  userStore.userLogout();
  router.push('/login');
}

</script>

<style scoped>
.logo {
  text-align: center;
  line-height: 32px;
  height: 32px;
  margin: 16px;
  color:#fff;
  font-size: 20px;
}
</style>
