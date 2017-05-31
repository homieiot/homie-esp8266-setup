<template>
  <span v-if="!loading">
    <div v-if="apiResponse.success === true" class="notification is-success">
      The configuration was sent. Your device will reboot. You can close this page.
    </div>
    <div v-else class="notification is-danger">
      There was an error while sending the configuration: {{ apiResponse.error }}
      <br />
      Please retry or report if it looks like a bug.
    </div>
  </span>
</template>

<script>
import axios from 'axios'
import {API_URL} from '../../constants'

export default {
  data () {
    return {
      loading: true,
      apiResponse: null
    }
  },
  props: ['configuration'],
  mounted () {
    this.$emit('loading', 'Sending configuration to the device...')
    axios.put(`${API_URL}/config`, this.configuration).then((res) => {
      this.$emit('loaded')
      this.apiResponse = res.data
      this.loading = false
    }).catch((err) => {
      this.$emit('loaded')
      if (err.response) this.apiResponse = err.response.data
      else this.apiResponse = { error: err.message }
      this.loading = false
    })
  }
}
</script>
