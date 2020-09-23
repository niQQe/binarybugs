import Vue from 'vue'
import App from './App.vue'
import router from '../router';
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
