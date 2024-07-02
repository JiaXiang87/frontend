<script setup lang="ts">
</script>

<!-- <template>
  <div>
    <button @click="startConversation">Start Conversation</button>
    <input v-if="sessionId" v-model="userInput" @keyup.enter="continueConversation" placeholder="Type your response..."/>
    <button v-if="sessionId" @click="continueConversation">Send</button>
    <audio v-if="audioUrl" :src="audioUrl" controls></audio>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInput: '',
      audioUrl: null,
      sessionId: null
    };
  },
  methods: {
    async startConversation() {
      try {
        const response = await axios.post('http://localhost:5000/start_conversation');
        this.audioUrl = response.data.audio_url;
        this.sessionId = response.data.session_id;
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    },
    async continueConversation() {
      if (!this.userInput) {
        alert('Please enter a response.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/continue_conversation', {
          text: this.userInput,
          session_id: this.sessionId
        });

        if (response.data.message === "对话已结束") {
          this.audioUrl = null;
          this.sessionId = null;
          alert("对话已结束");
        } else {
          this.audioUrl = response.data.audio_url;
          this.userInput = '';
        }
      } catch (error) {
        console.error('Error continuing conversation:', error);
      }
    }
  }
};
</script> -->


<template>
  <div>
    <button @click="startConversation">Start Conversation</button>
    <button v-if="sessionId" @click="recordAudio">{{ recording ? 'Stop' : 'Record' }}</button>
    <audio v-if="openingAudioUrl" :src="openingAudioUrl" ref="openingAudioPlayer" controls></audio>
    <audio v-if="replyAudioUrl" :src="replyAudioUrl" ref="replyAudioPlayer" controls></audio>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInput: '',
      openingAudioUrl: null,
      replyAudioUrl: null,
      sessionId: null,
      recorder: null,
      audioChunks: [],
      recording: false
    };
  },
  methods: {
    async startConversation() {
      try {
        const response = await axios.post('http://localhost:5000/start_conversation');
        this.openingAudioUrl = response.data.opening_audio_url;
        this.replyAudioUrl = response.data.reply_audio_url;
        this.sessionId = response.data.session_id;
        this.playAudio('opening');
        this.playAudio('reply');
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    },
    async recordAudio() {
      if (!this.recording) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    },
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.recorder = new MediaRecorder(stream);
          this.recorder.ondataavailable = e => {
            this.audioChunks.push(e.data);
          };
          this.recorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64String = reader.result.split(',')[1];
              try {
                const response = await axios.post('http://localhost:5000/continue_conversation', {
                  audio: base64String,
                  session_id: this.sessionId
                });
                if (response.data.message === "对话已结束") {
                  this.replyAudioUrl = null;
                  this.sessionId = null;
                  alert("对话已结束");
                } else {
                  this.replyAudioUrl = response.data.audio_url;
                  this.playAudio('reply');
                }
              } catch (error) {
                console.error('Error continuing conversation:', error);
              }
            };
          };
          this.recorder.start();
          this.audioChunks = [];
          this.recording = true;
        })
        .catch(error => console.error('Error accessing microphone:', error));
    },
    stopRecording() {
      this.recorder.stop();
      this.recorder = null;
      this.recording = false;
    },
    playAudio(type) {
      this.$nextTick(() => {
        const audioElement = type === 'opening' ? this.$refs.openingAudioPlayer : this.$refs.replyAudioPlayer;
        if (audioElement) {
          audioElement.play();
        }
      });
    }
  }
};
</script>
