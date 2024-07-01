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
    }
  }
});
