import Vue from 'vue';
import App from './App.vue';
import router from '../router';
import VueChatScroll from 'vue-chat-scroll';
import store from './store'
import Socket from './api/socket'
export const bus = new Vue();
Vue.use(VueChatScroll);


Vue.prototype.$socket = new Socket(store)

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
	store,
	router,
}).$mount('#app');

