<template>
  <span v-if="!loading">
    <div v-if="apiResponse.success === true" class="notification is-success">
      The configuration was sent. Your device will reboot. You can close this page.
    </div>
    <div v-else class="notification is-danger">
      <p>There was an error while sending the configuration:</p>
      <p>{{ apiResponse.error }}</p>
      <p>Please retry or report if it looks like a bug.</p>
    </div>
    <p class="control">
      <button class="button is-primary" v-on:click="sendConfig">Retry</button>
    </p>
  </span>
</template>

<script>
import axios from "axios";
import { API_URL } from "../../constants";
import buildPatchConfig from "../utils/buildPatchConfig";

export default {
  data() {
    return {
      loading: true,
      apiResponse: null
    };
  },
  props: ["currentConfig", "newConfig"],
  mounted() {
    this.sendConfig();
  },
  methods: {
    sendConfig: function() {
      this.$emit("loading", "Sending configuration to the device...");
      this.loading = true;
      console.log("send");

      let isPUT = true;
      let path = "/config";
      let config;
      if (this.currentConfig) {
        isPUT = false;
        path = "/config/patch";
        config = buildPatchConfig(this.currentConfig, this.newConfig);
      } else {
        config = this.newConfig;
      }
      if (config) {
        this.callSetConfigAPI(path, config, isPUT);
      } else {
        this.onError("No Changes were made.");
      }
    },
    callSetConfigAPI: function(path, config, isPUT = true) {
      axios
        .request({
          method: isPUT ? "PUT" : "POST",
          url: path,
          baseURL: API_URL,
          data: config
        })
        .then(res => {
          this.$emit("loaded");
          this.apiResponse = res.data;
          this.loading = false;
        })
        .catch(err => {
          if (err.response) this.onError(err.response.data);
          else this.onError({ error: err.message });
        });
    },
    onError: function(error) {
      this.$emit("loaded");
      if (typeof error === "object") {
        this.apiResponse = error;
      } else {
        this.apiResponse = { error };
      }
      this.loading = false;
    }
  }
};
</script>
