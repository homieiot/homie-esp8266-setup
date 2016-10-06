'use strict'

import Vue from 'vue'

import App from './app.vue'

const vue = new Vue({
  el: '#app',
  render: function (createElement) {
    return createElement(App)
  }
})

export default vue
