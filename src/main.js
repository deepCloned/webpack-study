import Vue from 'vue';
import router from './router';
import App from './App';

import './styles/index.scss';

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app');