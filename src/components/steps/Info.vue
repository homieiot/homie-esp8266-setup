<template>
  <div v-if="!loading">
    <div class="columns">
      <div class="column">
         <p>Here are some information about the device you are about to configure:</p>
        <ul>
          <li><info-item label="Homie Convention version:" :value="deviceInfo.homie_version" icon="icon-tag"/></li>
          <li><info-item label="Homie for ESP8266 version:" :value="deviceInfo.homie_esp8266_version" icon="icon-tag"/></li>
          <li><info-item label="Hardware device ID:" :value="deviceInfo.device_hardware_id" icon="icon-hashtag"/></li>
          <li><info-item label="Device Config State:" :value="deviceInfo.device_config_state?'Valid':'Invalid'" icon="icon-info" :colour="deviceInfo.device_config_state?'is-success':'is-warning'"/></li>
          <li>
            <span><i class="icon is-small icon-microchip"></i> <b>Firmware</b></span>
            <ul>
              <li><info-item label="Name:" :value="deviceInfo.firmware.name" icon="icon-asterisk"/></li>
              <li><info-item label="Version:" :value="deviceInfo.firmware.version" icon="icon-tag"/></li>
            </ul>
          </li>
          <li>
            <span><i class="icon is-small icon-cubes"></i> <b>Nodes:</b></span>
            <table class="table">
              <thead>
                <tr>
                  <th><span><i class="icon is-small icon-hashtag"></i></span> ID</th>
                  <th><span><i class="icon is-small icon-link"></i></span> Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="node in deviceInfo.nodes" :key="node.id">
                  <td>{{ node.id }}</td>
                  <td>{{ node.type }}</td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      </div>
      <div class="column">
        <p>Here is some information about the device's current configuration:</p>
        <div v-if="deviceConfig">
          <ul>
            <li><info-item label="Device Name:" :value="deviceConfig.name" icon="icon-asterisk"/></li>
            <li><info-item label="Device ID:" :value="deviceConfig.device_id" icon="icon-hashtag"/></li>
          </ul>
        </div>
        <div v-else>
          <p>Faild to get the device's current configuration.</p>
          <p v-if="deviceConfigErrorMessage">Reason: {{ deviceConfigErrorMessage }}</p>
        </div>
      </div>
    </div>
    <a class="button is-primary" @click="sendDone">Next</a>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "../../constants";
import InfoItem from "../utils/InfoItem.vue";

export default {
  data() {
    return {
      loading: true,
      deviceInfo: null,
      deviceConfig: null,
      deviceConfigErrorMessage: null
    };
  },
  mounted() {
    this.$emit("loading", "Gathering device information...");
    axios
      .get(`${API_URL}/device-info`)
      .then(res => {
        this.$emit("loaded");
        this.deviceInfo = res.data;
        this.$emit("deviceInformation", this.deviceInfo);
        this.loading = false;
      })
      .catch(() => {});
    axios
      .get(`${API_URL}/config`)
      .then(res => {
        this.deviceConfig = res.data;
        this.$emit("deviceConfig", this.deviceConfig);
      })
      .catch(res => {
        if (res.data && res.data.error)
          this.deviceConfigErrorMessage = res.data.error;
      });
  },
  methods: {
    sendDone: function() {
      this.$emit("done");
    }
  },
  components: {
    "info-item": InfoItem
  }
};
</script>
