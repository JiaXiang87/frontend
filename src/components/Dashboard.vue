<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider collapsible v-model:collapsed="collapsed" @collapse="handleCollapse">
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[selectedKey]" @click="updateSelectedKey">
        <a-menu-item key="1">
          <router-link to="/">
            <pie-chart-outlined />
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
            <pie-chart-outlined />
            <span>监控管理</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <template #title>
            <user-outlined />
            <span>事件管理</span>
          </template>
          <a-menu-item key="4-1">
            <router-link to="/events">事件列表</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="5">
          <router-link to="/aiChat">
            <pie-chart-outlined />
            <span>智能语言聊天</span>
          </router-link>
        </a-menu-item>
        <!--  <a-menu-item key="3">
          <router-link to="/about">
            <file-outlined />
            <span>关于我们</span>
          </router-link>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 头部 -->
      <!-- <header style="background: #fff; display: flex; padding-bottom: 10px; align-items: center;">
        <a-breadcrumb style="">
          <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            {{ breadcrumb }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </header> -->

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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { PieChartOutlined, DesktopOutlined, FileOutlined, UserOutlined } from '@ant-design/icons-vue';

const collapsed = ref(false);
const handleCollapse = (collapse: boolean) => {
  collapsed.value = collapse;
};

const route = useRoute();
const selectedKey = ref('1');

const updateSelectedKey = (e: any) => {
  selectedKey.value = e.key;
};

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(p => p);
  const breadcrumbs = paths.map((path, index) => {
    // 你可以根据你的路由结构自定义显示的文本
    if (path === 'oldpersons') return '人员管理 / 老人管理';
    if (path === 'feature2') return '功能/功能2';
    return path;
  });

  return breadcrumbs.length ? breadcrumbs : ['首页'];
});

watch(route, () => {
  // 更新选中的菜单项
  if (route.path === '/') {
    selectedKey.value = '1';
  } else if (route.path.includes('feature1')) {
    selectedKey.value = '2-1';
  } else if (route.path.includes('feature2')) {
    selectedKey.value = '2-2';
  } else if (route.path.includes('about')) {
    selectedKey.value = '3';
  }
});
</script>

<style scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
