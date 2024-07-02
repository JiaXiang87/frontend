<template>
  <a-card class="chat-container">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message" :class="{ 'from-user': message.fromUser }">
        <a-avatar v-if="!message.fromUser" :src="aiAvatar" class="avatar" />
        <div class="text" :class="{ 'from-user': message.fromUser }">{{ message.text }}</div>
        <a-avatar v-if="message.fromUser" :src="userAvatar" class="avatar" />
      </div>
    </div>
    <div class="input-area">
      <a-input v-model:value="currentMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
      <a-button type="primary" icon="send" @click="sendMessage">发送</a-button>
      <a-button type="dashed" icon="audio" @click="simulateVoiceInput">语音</a-button>
    </div>
    <audio v-if="audioUrl" :src="audioUrl" controls ref="audioPlayer"></audio>
  </a-card>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import axios from 'axios';

const userAvatar = ref<string>('path/to/user-avatar.jpg');
const aiAvatar = ref<string>('path/to/ai-avatar.jpg');
const currentMessage = ref<string>('');
const messages = ref<Array<{id: number, text: string, fromUser: boolean}>>([]);
const sessionId = ref<string | null>(null);
const audioUrl = ref<string | null>(null);
const recorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);

async function startConversation() {
  try {
    const response = await axios.post('http://localhost:5000/start_conversation');
    sessionId.value = response.data.session_id;
    const openingMessage = {
      id: messages.value.length + 1,
      text: response.data.opening_text,
      fromUser: false
    };
    messages.value.push(openingMessage);
    const replyMessage = {
      id: messages.value.length + 2,
      text: response.data.reply_text,
      fromUser: false
    };
    messages.value.push(replyMessage);
    audioUrl.value = response.data.reply_audio_url;
    playAudio();
  } catch (error) {
    console.error('Error starting conversation:', error);
  }
}

function sendMessage() {
  if (currentMessage.value.trim() !== '') {
    const userMessage = {
      id: messages.value.length + 1,
      text: currentMessage.value,
      fromUser: true
    };
    messages.value.push(userMessage);
    handleConversation(userMessage.text);
    currentMessage.value = ''; // 清空输入框
  }
}

function simulateVoiceInput() {
  if (!recorder.value) {
    startRecording();
  } else {
    stopRecording();
  }
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recorder.value = new MediaRecorder(stream);
      recorder.value.ondataavailable = e => {
        audioChunks.value.push(e.data);
      };
      recorder.value.onstop = async () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64AudioMessage = reader.result?.toString().split(',')[1];
          handleVoiceConversation(base64AudioMessage || '');
        };
        reader.readAsDataURL(audioBlob);
        audioChunks.value = [];
      };
      recorder.value.start();
    })
    .catch(error => console.error('Error accessing microphone:', error));
}

function stopRecording() {
  recorder.value?.stop();
}

async function handleConversation(userInput: string) {
  try {
    const response = await axios.post('http://localhost:5000/continue_conversation', {
      text: userInput,
      session_id: sessionId.value
    });
    const aiMessage = {
      id: messages.value.length + 1,
      text: response.data.reply_text,
      fromUser: false
    };
    messages.value.push(aiMessage);
    audioUrl.value = response.data.audio_url;
    playAudio();
  } catch (error) {
    console.error('Error continuing conversation:', error);
  }
}

async function handleVoiceConversation(audioBase64: string) {
  try {
    const response = await axios.post('http://localhost:5000/continue_conversation', {
      audio: audioBase64,
      session_id: sessionId.value
    });
    const aiMessage = {
      id: messages.value.length + 1,
      text: response.data.reply_text,
      fromUser: false
    };
    messages.value.push(aiMessage);
    audioUrl.value = response.data.audio_url;
    playAudio();
  } catch (error) {
    console.error('Error continuing conversation:', error);
  }
}

function playAudio() {
  const audioElement = (this.$refs.audioPlayer as HTMLAudioElement);
  if (audioElement) {
    audioElement.play();
  }
}

startConversation();
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
