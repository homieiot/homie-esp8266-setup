<template>
  <p>
    Connect to your device Wi-Fi AP. It should be named something like <strong>Homie-123456abcdef</strong>.
    Note this configurator is only for Homie for ESP8266 v2. The v1 configurator is available <a href="https://github.com/marvinroger/homie-esp8266/releases/download/v1.5.0/homie-esp8266-v1-setup.zip">here</a>.
  </p>
</template>

<script>
import axios from "axios";
import { API_URL, HEARTBEAT_ATTEMPT_INTERVAL } from "../../constants";

export default {
  data() {
    return {
      requestOnGoing: false,
      interval: null
    };
  },
  mounted() {
    this.$emit("loading", "Waiting for the device...");
    this.interval = setInterval(this.sendRequest, HEARTBEAT_ATTEMPT_INTERVAL);
  },
  methods: {
    sendRequest: function() {
      if (this.requestOnGoing) return;

      this.requestOnGoing = true;
      axios
        .get(`${API_URL}/heart`)
        .then(res => {
          clearInterval(this.interval);
          this.$emit("loaded");
          this.$emit("done");
        })
        .catch(() => {
          this.requestOnGoing = false;
        });
    }
  }
};
</script>
