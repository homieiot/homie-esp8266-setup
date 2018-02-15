import './components/styles.scss'
import './components/utils/icons'
import Vue from 'vue'
import App from './components/App'

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

// favicon
import favicon from './assets/favicon.png'
(function () {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = favicon;
  document.getElementsByTagName('head')[0].appendChild(link);
})();