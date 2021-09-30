<template>
  <p>
    <span v-if="!isHttp()">
      <div class="notification is-warning" >
        This site is served via secure TSL/SSL. Unfortunately this prevents your browser from detecting your device.
        Please use the following link to setup your device: <br/> <a v-bind:href="httpUrl"> {{ httpUrl }}</a>
      </div>
    </span>
    <span v-html="description"></span>
  </p>
</template>

<script>
import axios from 'axios'
import {API_URL, HEARTBEAT_ATTEMPT_INTERVAL} from '../../constants'

export default {
  data () {
    return {
      requestOnGoing: false,
      interval: null,
      httpUrl: this.getHttpUrl(),
      description: process.env.DESCRIPTION,
    }
  },
  mounted () {
    this.$emit('loading', 'Waiting for the device...')
    this.interval = setInterval(this.sendRequest, HEARTBEAT_ATTEMPT_INTERVAL)
  },
  methods: {
    isHttp: function() {
      return window.location.protocol === 'http:';
    },
    getHttpUrl: function() {
      var url = document.createElement('a');
      url.href = window.location.href;
      url.protocol = 'http:';
      return url.href;
    },

    sendRequest: function () {
      if (this.requestOnGoing) return

      this.requestOnGoing = true
      axios.get(`${API_URL}/heart`).then((res) => {
        clearInterval(this.interval)
        this.$emit('loaded')
        this.$emit('done')
      }).catch(() => {
        this.requestOnGoing = false
      })
    }
  }
}
</script>
