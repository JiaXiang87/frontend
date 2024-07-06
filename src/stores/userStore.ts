import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: 0,
      username: '',
      realName: '',
      email: ''
    },
    token: '',
  }),
  actions: {
    userLogin(userInfo: { id: number, username: string, realName: string, email: string }, token: string) {
      this.userInfo = userInfo;
      this.token = token;
    },
    userLogout() {
      this.userInfo = { id: 0, username: '', realName: '', email: '' };
      this.token = '';
    },
    async fetchUserInfo() {
      if (localStorage.getItem("token")) {
        this.token = localStorage.getItem("token") || '';
        const response = await fetch('http://47.102.213.168:8080/admin/info', {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        this.userInfo = {
          id: data.id,
          username: data.username,
          realName: data.real_name,
          email: data.email
        };
      }
    },
  }
});
