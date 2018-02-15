<template>
  <span>
    <p>
      Enter the MQTT credentials.
    </p>

    <form @submit.prevent="sendDone">
      <label class="label" for="mqtt_broker_address">MQTT broker address</label>
      <p class="control">
        <input v-model.trim="host" class="input" type="text" id="mqtt_broker_address" placeholder="IP or hostname" pattern="^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$" required />
        <span class="help">Required.</span>
      </p>

      <label class="label" for="mqtt_broker_port">MQTT broker port</label>
      <p class="control">
        <input v-model.number="port" class="input" type="number" step="1" min="1" max="65535" id="mqtt_broker_port" placeholder="Port number" required />
        <span class="help">Required.</span>
      </p>

      <label class="label" for="homie_base_topic">Homie base topic</label>
      <p class="control">
        <input v-model.trim="baseTopic" class="input" type="text" id="homie_base_topic" placeholder="Base topic" />
        <span class="help">Optional. The default value is <span class="tag">homie/</span>.</span>
      </p>

      <p class="control">
        <label class="checkbox">
          <input v-model="auth" type="checkbox" /> Use MQTT authentication
        </label>
      </p>
      <div v-if="auth">
        <label class="label" for="mqtt_username">MQTT username</label>
        <p class="control">
          <input v-model.trim="username" class="input" type="text" id="mqtt_username" placeholder="Username" required />
          <span class="help">Required.</span>
        </p>

        <label class="label" for="mqtt_password">MQTT password</label>
        <p class="control is-grouped">
          <input :type="passwordClearText?'text':'password'" class="input" v-model.trim="password" id="mqtt_password" placeholder="Password" required />
          <label class="checkbox"><input type="checkbox" v-model="passwordClearText" /> Show password</label>
          <span class="help">Required.</span>
        </p>
        <br/>
      </div>

      <p class="control">
        <label class="checkbox"><input v-model="ssl" type="checkbox" /> Use MQTT TLS (SSL)</label>
      </p>
      <div v-if="ssl">
        <label class="label" for="mqtt_username">MQTT SSL Certificate Fingerprint</label>
        <p class="control">
          <input v-model.trim="ssl_fingerprint" class="input" type="text" id="mqtt_ssl_fingerprint" placeholder="SSL Fingerprint" maxlength="40" />
          <span class="help">Optional. SHA1 Fingerprint (40 hex char)</span>
        </p>
        <br />
      </div>

      <p class="control">
        <button type="submit" :disabled="!formIsValid" class="button is-primary">Next</button>
      </p>
    </form>
  </span>
</template>

<script>
import { KEEP } from "../../constants";

export default {
  data() {
    return {
      passwordClearText: false,
      host: null,
      port: 1883,
      baseTopic: null,
      auth: false,
      username: null,
      password: null,
      ssl: false,
      ssl_fingerprint: null
    };
  },
  props: ["currentConfig"],
  computed: {
    formIsValid: function() {
      if (!this.host || !this.port) return false;
      if (this.auth) {
        if (!this.username || !this.password) return false;
      }
      return true;
    }
  },
  mounted() {
    this.loadCurrentConfig();
  },
  methods: {
    sendDone: function() {
      const mqtt = {};
      mqtt.host = this.host;
      mqtt.port = this.port;
      if (this.baseTopic) mqtt.base_topic = this.baseTopic;

      if (this.auth) {
        mqtt.auth = this.auth;
        mqtt.username = this.username;
        mqtt.password = this.password;
      }

      if (this.ssl) {
        mqtt.ssl = this.ssl;
        if (this.ssl_fingerprint) mqtt.ssl_fingerprint = this.ssl_fingerprint;
      }

      this.$emit("mqttConfig", mqtt);
      this.$emit("done");
    },
    loadCurrentConfig: function() {
      if (this.currentConfig) {
        this.host = this.currentConfig.host;
        this.port = this.currentConfig.port;
        this.baseTopic = this.currentConfig.base_topic;
        this.auth = this.currentConfig.auth;
        this.username = this.currentConfig.username || KEEP;
        this.password = this.currentConfig.password || KEEP;
        if (this.password === KEEP) this.passwordClearText = true;
        this.ssl = this.currentConfig.ssl;
        this.ssl_fingerprint = this.currentConfig.ssl_fingerprint;
      }
    }
  }
};
</script>
