<template>
  <div v-if="!loading">
    <div class="content">
      <h4 class="title is-4">Here are some information about the device you are about to configure:</h4>
      <ul>
        <li><info-item label="Homie Convention version:" :value="deviceInfo.homie_version" icon="icon-tag"/></li>
        <li><info-item label="Homie for ESP8266 version:" :value="deviceInfo.homie_esp8266_version" icon="icon-tag"/></li>
        <li><info-item label="Hardware device ID:" :value="deviceInfo.device_hardware_id" icon="icon-hashtag"/></li>
        <li><info-item label="Device Config State:" :value="deviceInfo.device_config_state?'Valid':'Invalid'" icon="icon-info" :colour="deviceInfo.device_config_state?'is-success':'is-warning'"/></li>
        <li v-if="!deviceInfo.device_config_state"><info-item label="Device Config State Error Message:" :value="deviceInfo.device_config_state_error" icon="icon-hashtag"/></li>
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

    <div class="content">
      <h4 class="title is-4">Here is some information about the device's current configuration:</h4>
      <div v-if="deviceConfig">
        <ul>
          <li><info-item label="Device Name:" :value="deviceConfig.name" icon="icon-asterisk"/></li>
          <li><info-item label="Device ID:" :value="deviceConfig.device_id" icon="icon-hashtag"/></li>
          <li v-if="deviceConfig.device_stats_interval"><info-item label="Device Status Interval:" :value="deviceConfig.device_stats_interval" icon="icon-hashtag"/></li>
          <li>
            <span><i class="icon is-small icon-microchip"></i> <b>WiFi</b></span>
            <ul>
              <li><info-item label="SSID:" :value="deviceConfig.wifi.ssid" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.bssid"><info-item label="BSSID:" :value="deviceConfig.wifi.bssid" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.channel"><info-item label="Channel:" :value="deviceConfig.wifi.channel" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.ip"><info-item label="IP:" :value="deviceConfig.wifi.ip" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.mask"><info-item label="Mask:" :value="deviceConfig.wifi.mask" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.gw"><info-item label="Gateway:" :value="deviceConfig.wifi.gw" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.dns1"><info-item label="DNS 1:" :value="deviceConfig.wifi.dns1" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.wifi.dns2"><info-item label="DNS 2:" :value="deviceConfig.wifi.dns2" icon="icon-hashtag"/></li>
            </ul>
          </li>
          <li>
            <span><i class="icon is-small icon-microchip"></i> <b>MQTT</b></span>
            <ul>
              <li><info-item label="Host:" :value="deviceConfig.mqtt.host" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.mqtt.port"><info-item label="Port:" :value="deviceConfig.mqtt.port" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.mqtt.base_topic"><info-item label="Base Topic:" :value="deviceConfig.mqtt.base_topic" icon="icon-hashtag"/></li>
              <li><info-item label="Auth:" :value="deviceConfig.mqtt.auth?'Yes':'No'" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.mqtt.username"><info-item label="Username:" :value="deviceConfig.mqtt.username" icon="icon-hashtag"/></li>
              <li><info-item label="SSL:" :value="deviceConfig.mqtt.ssl?'Yes':'No'" icon="icon-hashtag"/></li>
              <li v-if="deviceConfig.mqtt.ssl"><info-item label="SSL Fingerprint:" :value="deviceConfig.mqtt.ssl_fingerprint" icon="icon-hashtag"/></li>
            </ul>
          </li>
          <li>
            <span><i class="icon is-small icon-microchip"></i> <b>OTA</b></span>
            <ul>
              <li><info-item label="Enabled:" :value="deviceConfig.ota.enabled?'Yes':'No'" icon="icon-hashtag"/></li>
            </ul>
          </li>
          <li>
            <span><i class="icon is-small icon-microchip"></i> <b>Settings</b></span>
            <ul>
              <li v-for="key in Object.keys(deviceConfig.settings)" :key="key"><info-item :label="key" :value="deviceConfig.settings[key]" icon="icon-hashtag"/></li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else>
        <p><b>Faild to get the device's current configuration.</b></p>
        <info-item label="Reason:" :value="deviceConfigErrorMessage" icon="icon-hashtag"/>
      </div>
    </div>

    <p class="control">
      <a class="button is-primary" @click="sendDone">Next</a>
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL, KEEP } from "../../constants";
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
        if (res.response.data)
          this.deviceConfigErrorMessage = res.response.data.error;
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
