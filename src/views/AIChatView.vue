<template>
  <a-card class="chat-container">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" >
        <div v-if="!message.fromUser">
          <div class="message">
            <a-avatar :src="aiAvatar" class="avatar" />
            <div class="text" v-if="message.text" :class="{ 'from-user': message.fromUser }">{{ message.text }}</div>
          </div>
          <audio style="margin-left: 30px;" v-if="message.audioUrl" controls :src="message.audioUrl" class="audio-message"></audio>
        </div>
        <div v-if="message.fromUser" class="message from-user" >
          <div class="text" v-if="message.text" :class="{ 'from-user': message.fromUser }">{{ message.text }}</div>
          <audio v-if="message.audioUrl" controls :src="message.audioUrl" class="audio-message"></audio>
          <a-avatar  :src="userAvatar" class="avatar" />
        </div>
      </div>
    </div>
    <div class="input-area">
      <a-input v-model:value="currentMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
      <a-button type="primary" icon="send" @click="sendMessage">发送</a-button>
      <a-button type="dashed" icon="audio" @click="simulateVoiceInput">
        {{ isRecording ? '停止' : '语音' }}
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userAvatar = ref<string>('path/to/user-avatar.jpg');
const aiAvatar = ref<string>('path/to/ai-avatar.jpg');
const currentMessage = ref<string>('');
const messages = ref<Array<{id: number, text?: string, audioUrl?: string, isAudio?: boolean, fromUser: boolean}>>([]);
const sessionId = ref<string | null>(null);
const recorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const isRecording = ref<boolean>(false);

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
      audioUrl: response.data.reply_audio_url,
      fromUser: false
    };
    messages.value.push(replyMessage);
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
  if (!isRecording.value) {
    startRecording();
  } else {
    stopRecordingAndSend();
  }
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorder.value.ondataavailable = e => {
        audioChunks.value.push(e.data);
      };
      recorder.value?.start();
      isRecording.value = true;
    })
    .catch(error => console.error('Error accessing microphone:', error));
}

function stopRecordingAndSend() {
  if (recorder.value) {
    recorder.value.stop();
    isRecording.value = false;
    recorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const userAudioMessage = {
        id: messages.value.length + 1,
        audioUrl: audioUrl,
        isAudio: true,
        fromUser: true
      };
      messages.value.push(userAudioMessage);
      const pcmAudioBlob = await convertToPCM(audioBlob);
      sendAudioToServer(pcmAudioBlob);
      audioChunks.value = [];
    };
  }
}

async function convertToPCM(blob: Blob): Promise<Blob> {
  const audioContext = new AudioContext({ sampleRate: 16000 }); // Ensure 16kHz
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const pcmArrayBuffer = audioBufferToPCM(audioBuffer);

  return new Blob([pcmArrayBuffer], { type: 'audio/pcm' });
}

function audioBufferToPCM(audioBuffer: AudioBuffer): ArrayBuffer {
  const length = audioBuffer.length * audioBuffer.numberOfChannels * 2; // 16-bit audio
  const result = new ArrayBuffer(length);
  const view = new DataView(result);

  let offset = 0;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      let sample = audioBuffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample)); // Clamp sample value
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true); // PCM 16-bit signed little-endian
      offset += 2;
    }
  }

  return result;
}

async function sendAudioToServer(audioBlob: Blob) {
  const reader = new FileReader();

  reader.onload = async () => {
    const base64Audio = reader.result ? reader.result.toString().split(',')[1] : '';

    const payload = {
      audio: base64Audio,
      session_id: sessionId.value
    };
    
    try {
      const response = await axios.post('http://localhost:5000/continue_conversation', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const aiMessage = {
        id: messages.value.length + 1,
        text: response.data.reply_text,
        audioUrl: response.data.audio_url,
        fromUser: false
      };
      messages.value.push(aiMessage);
    } catch (error) {
      console.error('Error continuing conversation:', error);
    }
  };

  reader.onerror = error => {
    console.error('Error reading audio file:', error);
  };

  reader.readAsDataURL(audioBlob);
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
      audioUrl: response.data.audio_url,
      fromUser: false
    };
    messages.value.push(aiMessage);
  } catch (error) {
    console.error('Error continuing conversation:', error);
  }
}

onMounted(() => {
  startConversation();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 500px;  /* 限制整个聊天容器的高度 */
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
  margin-left: 8px;
  background-color: #e6ffe6; 
}

.text {
  padding: 6px 12px;
  background-color: #f0f0f0; 
  border-radius: 10px;
  max-width: 70%; /* 限制最大宽度 */
}

.avatar {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
}

.audio-message {
  max-width: 70%; /* 限制最大宽度 */
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 10px;
}
</style>
