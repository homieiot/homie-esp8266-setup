<template>
  <span>
    <span v-if="!loading">
      <p>
        Here are some information about the device you are about to configure:
      </p>

      <ul>
        <li><span class="icon is-small"><i class="fa fa-hashtag"></i></span> <b>Hardware device ID:</b> <span class="tag is-dark">{{ apiResponse.hardware_device_id }}</span></li>
        <li><span class="icon is-small"><i class="fa fa-tag"></i></span> <b>Homie for ESP8266 version:</b> <span class="tag is-dark">{{ apiResponse.homie_esp8266_version }}</span></li>
        <li>
          <span class="icon is-small">
            <i class="fa fa-font"></i>
          </span>
          <b>Firmware</b>
          <ul>
            <li><b>Name:</b> <span class="tag is-dark">{{ apiResponse.firmware.name }}</span></li>
            <li><b>Version:</b> <span class="tag is-dark">{{ apiResponse.firmware.version }}</span></li>
          </ul>
        </li>
        <li>
          <span class="icon is-small"><i class="fa fa-cubes"></i></span> <b>Nodes:</b>
          <table class="table">
            <thead>
              <tr>
                <th><span class="icon is-small"><i class="fa fa-hashtag"></i></span> ID</th>
                <th><span class="icon is-small"><i class="fa fa-link"></i></span> Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="node in apiResponse.nodes">
                <td>{{ node.id }}</td>
                <td>{{ node.type }}</td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>

      <a class="button is-primary" @click="sendDone">Next</a>
    </span>
  </span>
</template>

<script>
import axios from 'axios'
import {API_URL} from '../constants'

export default {
  data () {
    return {
      loading: true,
      apiResponse: null
    }
  },
  mounted () {
    this.$emit('loading', 'Gathering device information...')
    axios.get(`${API_URL}/device-info`).then((res) => {
      this.$emit('loaded')
      this.apiResponse = res.data
      this.$emit('deviceInformation', this.apiResponse)
      this.loading = false
    }).catch((err) => {
    })
  },
  methods: {
    sendDone: function () {
      this.$emit('done')
    }
  }
}
</script>


<style scoped>
  b {
    font-weight: bold;
  }
</style>
