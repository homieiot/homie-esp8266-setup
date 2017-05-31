import Vue from 'vue'
import App from './components/App.vue'

export const vue = new Vue({
  el: '#app',
  render: h => h(App)
})
