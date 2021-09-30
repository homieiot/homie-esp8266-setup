<template>
  <span>
    <h1 class="title">{{ title }}</h1>
    <h2 class="subtitle">{{ subtitle }}</h2>
    <progress-bar :current-step="currentStep" />
    <div class="content">
      <connection-step @done="goToNextStep" @loading="setLoading" @loaded="stopLoading" v-if="currentStep === 1" />
      <info-step @deviceInformation="receiveDeviceInformation" @done="goToNextStep" @loading="setLoading" @loaded="stopLoading" v-if="currentStep === 2" />
      <wifi-step @wifiConfig="receiveWifiConfig" @done="goToNextStep" @loading="setLoading" @loaded="stopLoading" v-if="currentStep === 3" />
      <mqtt-step @mqttConfig="receiveMqttConfig" @done="goToNextStep" v-if="currentStep === 4" />
      <settings-step :device-information="deviceInformation" @settingsConfig="receiveSettingsConfig" @done="goToNextStep" v-if="currentStep === 5" />
      <sending-step :configuration="config" @loading="setLoading" @loaded="stopLoading" v-if="currentStep === 6" />

      <div v-if="loading" class="notification">
        <span class="button is-loading">Loading</span> {{ loadingText }}
      </div>
    </div>
  </span>
</template>

<script>
import ProgressBar from './ProgressBar.vue'

import ConnectionStep from './steps/Connection.vue'
import InfoStep from './steps/Info.vue'
import WifiStep from './steps/Wifi.vue'
import MqttStep from './steps/Mqtt.vue'
import SettingsStep from './steps/Settings.vue'
import SendingStep from './steps/Sending.vue'

export default {
  data () {
    return {
      loading: false,
      loadingText: '',
      currentStep: 1,
      deviceInformation: {},
      config: {},
      title: process.env.TITLE,
      subtitle: process.env.SUBTITLE,
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

<style scoped>
  h1, h2 {
    text-align: center;
  }
</style>

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
