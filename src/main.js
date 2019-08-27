import Vue from 'vue';
import router from './router';
import App from './App';

import './styles/index.scss';
import './styles/iconfont.scss';

new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
}).$mount('#app');

// function getComponent() {
//   return import(/* webpackChunkName: "lodash" */'lodash').then(_ => {
//     var element = document.createElement('div');
//     var text = _.join(['hello', 'world'], '_');
//     element.innerHTML = text
//     return element;
//   })
// }

// getComponent().then(ele => {
//   document.body.appendChild(ele);
// })
