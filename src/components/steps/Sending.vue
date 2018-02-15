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
import axios from "axios";
import { API_URL } from "../../constants";

export default {
  data() {
    return {
      loading: true,
      apiResponse: null
    };
  },
  props: ["configuration"],
  mounted() {
    this.$emit("loading", "Sending configuration to the device...");
    // TODO: if has current config: 
    // if in new = KEEP -> remove prop
    // if in current but not in new -> add prop as null to remove it from config
    // if in new but not in currnt -> add new prop to be ser in the config
    // if in both -> overite config value eg ^
    axios
      .put(`${API_URL}/config`, this.configuration)
      .then(res => {
        this.$emit("loaded");
        this.apiResponse = res.data;
        this.loading = false;
      })
      .catch(err => {
        this.$emit("loaded");
        if (err.response) this.apiResponse = err.response.data;
        else this.apiResponse = { error: err.message };
        this.loading = false;
      });
  }
};
</script>
