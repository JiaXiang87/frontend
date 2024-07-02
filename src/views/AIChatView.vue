<template>
  <a-card class="chat-container">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message" :class="{ 'from-user': message.fromUser }">
        <!-- AI消息 -->
        <a-avatar v-if="!message.fromUser" :src="aiAvatar" class="avatar" />
        <div class="text" :class="{ 'from-user': message.fromUser }">{{ message.text }}</div>
        <!-- 用户消息 -->
        <a-avatar v-if="message.fromUser" :src="userAvatar" class="avatar" />
      </div>
    </div>
    <div class="input-area">
      <a-input v-model:value="currentMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
      <a-button type="primary" icon="send" @click="sendMessage">发送</a-button>
      <a-button type="dashed" icon="audio" @click="simulateVoiceInput">语音</a-button>
    </div>
  </a-card>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const userAvatar = ref<string>('path/to/user-avatar.jpg');
const aiAvatar = ref<string>('path/to/ai-avatar.jpg');
const currentMessage = ref<string>('');
const messages = ref<Array<{id: number, text: string, fromUser: boolean}>>([]);


function sendMessage() {
  if (currentMessage.value.trim() !== '') {
    messages.value.push({
      id: messages.value.length + 1,
      text: currentMessage.value,
      fromUser: true
    });
    // 模拟AI回复
    setTimeout(() => {
      messages.value.push({
        id: messages.value.length + 1,
        text: '你好，我是晓军',
        fromUser: false
      });
    }, 1000);
    currentMessage.value = ''; // 清空输入框
  }
}

function simulateVoiceInput() {
  // 模拟语音输入，实际项目中应连接到语音API
  messages.value.push({
    id: messages.value.length + 1,
    text: '这是一条语音消息',
    fromUser: true
  });
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;  /* 限制整个聊天容器的高度 */
  margin: 20px auto;
  width: 800px;
  border: 1px solid #ccc;
}

.messages {
  flex: 1;
  overflow-y: auto;  /* 消息部分可以滚动 */
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin: 5px;
  align-items: center;
}

.from-user {
  justify-content: flex-end;
}

.from-user .text {
  margin-left: 8px; /* 文本在头像左侧 */
  background-color: #e6ffe6; /* 浅绿色背景 */
}

.text {
  padding: 6px 12px;
  background-color: #f0f0f0; /* 浅灰色背景 */
  border-radius: 10px;
  max-width: 70%; /* 限制最大宽度 */
}

.avatar {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 10px;
}
</style>
