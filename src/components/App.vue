<template>
  <section class="section">
    <div class="container">
      <img class="logo center" src="../assets/img/logo.png" />
      <h1 class="title">Homie for ESP8266</h1>
      <h2 class="subtitle">Set up your device.</h2>
      <progress-bar :current-step="currentStep" />
      <div class="content">
        <connection-step @done="goToNextStep" @loading="setLoading" @loaded="stopLoading" v-if="currentStep === 1" />
        <info-step @done="goToNextStep" @loading="setLoading" @loaded="stopLoading" @deviceInformation="receiveDeviceInformation" @deviceConfig="receiveDeviceConfig" v-if="currentStep === 2" />
        <wifi-step :currentConfig="deviceConfig.wifi" @done="goToNextStep" @loading="setLoading" @loaded="stopLoading"  @wifiConfig="receiveWifiConfig" v-if="currentStep === 3" />
        <mqtt-step :currentConfig="deviceConfig.mqtt" @done="goToNextStep" @mqttConfig="receiveMqttConfig" v-if="currentStep === 4" />
        <settings-step :device-information="deviceInformation" @done="goToNextStep" @settingsConfig="receiveSettingsConfig" v-if="currentStep === 5" />
        <sending-step :configuration="config" @loading="setLoading" @loaded="stopLoading" v-if="currentStep === 6" />

        <div v-if="loading" class="notification">
          <span class="button is-loading ">Loading</span> {{ loadingText }}
        </div>
      </div>
      <menu-icon />
    </div>
  </section>
</template>

<script>
import ProgressBar from "./utils/ProgressBar";

import ConnectionStep from "./steps/Connection";
import InfoStep from "./steps/Info";
import WifiStep from "./steps/Wifi";
import MqttStep from "./steps/Mqtt";
import SettingsStep from "./steps/Settings";
import SendingStep from "./steps/Sending";

export default {
  name: "App",
  data() {
    return {
      loading: false,
      loadingText: "",
      currentStep: 1,
      deviceInformation: {},
      deviceConfig: {},
      config: {}
    };
  },
  methods: {
    goToNextStep: function() {
      this.currentStep++;
    },
    setLoading: function(text) {
      this.loadingText = text;
      this.loading = true;
    },
    stopLoading: function() {
      this.loading = false;
    },
    receiveDeviceInformation: function(deviceInformation) {
      this.deviceInformation = deviceInformation;
    },
    receiveDeviceConfig: function(deviceConfig) {
      this.deviceConfig = deviceConfig;
    },
    receiveWifiConfig: function(config) {
      this.config.wifi = config;
      console.log(config);
    },
    receiveMqttConfig: function(config) {
      this.config.mqtt = config;
      console.log(config);
    },
    receiveSettingsConfig: function(config) {
      this.config.name = config.name;
      this.config.ota = { enabled: config.ota };
      if (config["device_id"]) this.config["device_id"] = config["device_id"];
      if (Object.keys(config.settings).length !== 0)
        this.config.settings = config.settings;
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
};
</script>

<style scoped>
h1,
h2 {
  text-align: center;
}

.notification {
  text-align: center;
}
.notification .button.is-loading {
  background: transparent;
  border: none;
}

div.container{
  max-width: 600px;
}
</style>
