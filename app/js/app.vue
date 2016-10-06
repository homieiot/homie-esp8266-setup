<template>
  <span>
    <h1 class="title">Homie for ESP8266</h1>
    <h2 class="subtitle">Set up your device.</h2>
    <progress-bar v-bind:current-step="currentStep" />
    <div class="content">
      <connection-step v-on:done="goToNextStep" v-on:loading="setLoading" v-on:loaded="stopLoading" v-if="currentStep === 1" />
      <info-step v-on:deviceInformation="receiveDeviceInformation" v-on:done="goToNextStep" v-on:loading="setLoading" v-on:loaded="stopLoading" v-if="currentStep === 2" />
      <wifi-step v-on:wifiConfig="receiveWifiConfig" v-on:done="goToNextStep" v-on:loading="setLoading" v-on:loaded="stopLoading" v-if="currentStep === 3" />
      <mqtt-step v-on:mqttConfig="receiveMqttConfig" v-on:done="goToNextStep" v-if="currentStep === 4" />
      <settings-step v-bind:device-information="deviceInformation" v-on:settingsConfig="receiveSettingsConfig" v-on:done="goToNextStep" v-if="currentStep === 5" />
      <sending-step v-bind:configuration="config" v-on:loading="setLoading" v-on:loaded="stopLoading" v-if="currentStep === 6" />

      <div v-if="loading" class="notification">
        <span class="button is-loading">Loading</span> {{ loadingText }}
      </div>
    </div>
  </span>
</template>

<script>
import ProgressBar from './progressbar.vue'

import ConnectionStep from './steps/connection.vue'
import InfoStep from './steps/info.vue'
import WifiStep from './steps/wifi.vue'
import MqttStep from './steps/mqtt.vue'
import SettingsStep from './steps/settings.vue'
import SendingStep from './steps/sending.vue'

export default {
  data () {
    return {
      loading: false,
      loadingText: '',
      currentStep: 1,
      deviceInformation: {
        'hardware_device_id': '1234abcd',
        'homie_esp8266_version': '2.0.0',
        firmware: {
          name: 'smartlight',
          version: '1.0.0'
        },
        nodes: [{ type: 'switch', id: 'light' }],
        settings: [
          { "name": "bool-setting", "description": "This is a boolean", "type": "bool", "required": false, "default": true },
          { "name": "unsigned-long-setting", "description": "This is an unsigned long", "type": "ulong", "required": true },
          { "name": "long-setting", "description": "This is a long", "type": "long", "required": false, "default": 123 },
          { "name": "double-setting", "description": "This is a double", "type": "double", "required": true },
          { "name": "string-setting", "description": "This is a string", "type": "string", "required": false, "default": "default value" }
        ]
      },
      config: {}
    }
  },
  methods: {
    goToNextStep: function () {
      this.currentStep++
    },
    setLoading: function (text) {
      this.loadingText = text
      this.loading = true
    },
    stopLoading: function () {
      this.loading = false
    },
    receiveDeviceInformation: function (deviceInformation) {
      this.deviceInformation = deviceInformation
    },
    receiveWifiConfig: function (config) {
      this.config.wifi = config
    },
    receiveMqttConfig: function (config) {
      this.config.mqtt = config
    },
    receiveSettingsConfig: function (config) {
      this.config.name = config.name
      this.config.ota = { enabled: config.ota }
      if (config['device_id']) this.config['device_id'] = config['device_id']
      if (Object.keys(config.settings).length !== 0) this.config.settings = config.settings
    }
  },
  components: {
    ProgressBar,
    ConnectionStep,
    InfoStep,
    WifiStep,
    MqttStep,
    SettingsStep,
    SendingStep
  }
}
</script>

<style>
  html {
    background: #fff;
  }

  input:active, input:focus {
    border-color: #e74c3c !important;
  }

  .checkbox:hover input:checked, .checkbox input:checked {
    background: #e74c3c !important;
    border-color: #CE3323 !important;
  }

  .button.is-primary {
    background: #e74c3c;
  }

  .button.is-primary:hover, .button.is-primary:focus {
    background: #CE3323;
  }
</style>

<style scoped>
  .notification .button.is-loading {
    background: transparent;
    border: none;
  }
</style>
