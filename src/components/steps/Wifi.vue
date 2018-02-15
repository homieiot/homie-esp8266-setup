<template>
  <span v-if="!loading">
    <p>Select the Wi-Fi network to connect to:</p>

    <form @submit.prevent="sendDone">
      <label class="label" for="wifi_network">Network</label>
      <p class="control">
        <span class="select">
          <select v-model="ssid_select" id="wifi_network">
            <option value="select">Select...</option>
            <option v-for="network in formattedNetworks" :key="network.bssid" :value="network">
              {{ network.ssid }} - {{ network.encryption }} ({{ network.signal }}%)
            </option>
            <option value="other">Other/hidden network</option>
          </select>
        </span>
      </p>

      <p v-if="typeof ssid_select === 'object'">
        <label class="label">Network Details</label>
        <ul>
          <li><span class="icon is-small"><i class="icon-tag"></i></span> <b>SSID:</b> <span class="tag is-dark">{{ ssid_select.ssid }}</span></li>
          <li><span class="icon is-small"><i class="icon-tag"></i></span> <b>BSSID:</b> <span class="tag is-dark">{{ ssid_select.bssid }}</span></li>
          <li><span class="icon is-small"><i class="icon-tag"></i></span> <b>Encryption:</b> <span class="tag is-dark">{{ ssid_select.encryption }}</span></li>
          <li><span class="icon is-small"><i class="icon-tag"></i></span> <b>Signal:</b> <span class="tag is-dark">{{ ssid_select.signal }}%</span></li>
          <li><span class="icon is-small"><i class="icon-tag"></i></span> <b>RSSI:</b> <span class="tag is-dark">{{ ssid_select.rssi }}dBm</span></li>
        </ul>
      </p>

      <div v-if="ssid_select === 'other'">
        <label class="label" for="wifi_ssid">Wi-Fi SSID</label>
        <p class="control">
          <input class="input" v-model.trim="ssid_input" id="wifi_ssid" type="text" placeholder="SSID" maxLength="32" required />
          <span class="help">Required.</span>
        </p>
      </div>

      <div v-if="typeof ssid_select === 'object' && ssid_select.encryption !== 'Open' || ssid_select === 'other'">
        <label class="label" for="wifi_password">Wi-Fi password</label>
        <p class="control is-grouped">
          <input :type="passwordClearText?'text':'password'" class="input" v-model.trim="password" id="wifi_password" placeholder="Password" maxLength="64" />
          <label class="checkbox"><input type="checkbox" v-model="passwordClearText" /> Show password</label>
        </p>
        <span class="help">Optional. Leave blank if open network.</span>
        <br/>
      </div>

      <div v-if="ssid_select === 'other'">
        <p class="control">
          <label class="checkbox"><input v-model="manualAccessPoint" type="checkbox" /> Use a manual access point</label>
        </p>
        <div v-if="manualAccessPoint">
          <label class="label" for="wifi_bssid">Wi-Fi BSSID</label>
          <p class="control">
            <input class="input" v-model.trim="bssid" id="wifi_bssid" type="text" placeholder="BSSID" maxLength="17" />
            <span class="help">Required.</span>
          </p>
          <label class="label" for="wifi_bssid">Wi-Fi Channel</label>
          <p class="control">
            <input class="input" v-model.trim="channel" id="wifi_channel" type="number" placeholder="Channel Number" step="1" min="1" max="13" required />
            <span class="help">Required.</span>
          </p>
        </div>

        <p class="control">
          <label class="checkbox"><input v-model="staticIP" type="checkbox" /> Use a static IP</label>
        </p>
        <div v-if="staticIP">
          <label class="label" for="wifi_bssid">Wi-Fi Static IP</label>
          <p class="control">
            <input class="input" v-model.trim="ip" id="wifi_ip" type="text" placeholder="Static IP Address" maxLength="15" />
            <span class="help">Required.</span>
          </p>
          <label class="label" for="wifi_bssid">Wi-Fi Mask</label>
          <p class="control">
            <input class="input" v-model.trim="mask" id="wifi_mask" type="text" placeholder="Mask Address" maxLength="15" />
            <span class="help">Required.</span>
          </p>
          <label class="label" for="wifi_bssid">Wi-Fi Gateway</label>
          <p class="control">
            <input class="input" v-model.trim="gw" id="wifi_gw" type="text" placeholder="Gateway Address" maxLength="15" />
            <span class="help">Required.</span>
          </p>
          <label class="label" for="wifi_dns1">Wi-Fi DNS 1</label>
          <p class="control">
            <input class="input" v-model.trim="dns1" id="wifi_dns1" type="text" placeholder="DNS Address 1" maxLength="15" />
            <span class="help">Optional.</span>
          </p>
          <label class="label" for="wifi_dns2">Wi-Fi DNS 2</label>
          <p class="control">
            <input class="input" v-model.trim="dns2" id="wifi_dns2" type="text" placeholder="DNS Address 2" maxLength="15" />
            <span class="help">Optional.</span>
          </p>
        </div>

        <br />
      </div>

      <p class="control">
        <button type="submit" :disabled="!formIsValid" class="button is-primary">Next</button>
      </p>
    </form>
  </span>
</template>

<script>
import axios from "axios";
import { API_URL } from "../../constants";
import { KEEP } from "../../constants";

export default {
  data() {
    return {
      loading: true,
      apiResponse: null,
      ssid_select: "select",
      ssid_input: null,
      password: null,
      passwordClearText: false,
      manualAccessPoint: false,
      bssid: null,
      channel: 1,
      staticIP: false,
      ip: null,
      mask: null,
      gw: null,
      dns1: null,
      dns2: null
    };
  },
  props: ["currentConfig"],
  computed: {
    formattedNetworks: function() {
      let networks = this.apiResponse.networks.slice(0);
      networks.sort(function(networkA, networkB) {
        if (networkA.rssi > networkB.rssi) {
          return -1;
        } else if (networkA.rssi < networkB.rssi) {
          return 1;
        } else {
          return 0;
        }
      });

      networks = networks.map(function(network) {
        switch (network.encryption) {
          case "wep":
            network.encryption = "WEP";
            break;
          case "wpa":
            network.encryption = "WPA";
            break;
          case "wpa2":
            network.encryption = "WPA2";
            break;
          case "none":
            network.encryption = "Open";
            break;
          case "auto":
            network.encryption = "Automatic";
            break;
        }
        return network;
      });

      return networks;
    },
    computedSsid: function() {
      if (typeof this.ssid_select === "object") return this.ssid_select.ssid;
      else if (this.ssid_select === "other") return this.ssid_input;

      return null;
    },
    formIsValid: function() {
      const needPassword =
        typeof this.ssid_select === "object" &&
        this.ssid_select.encryption !== "Open";

      if (!this.computedSsid) return false;
      if (needPassword && !this.password) return false;
      if (this.manualAccessPoint) {
        if (!this.bssid || !this.channel) return false;
      }
      if (this.staticIP) {
        if (!this.ip || !this.mask || !this.gw) return false;
        if (!this.ip && this.dns1) return false;
        if (!this.dns1 && this.dns2) return false;
      }

      return true;
    }
  },
  mounted() {
    this.$emit("loading", "Gathering available Wi-Fi networks...");
    axios
      .get(`${API_URL}/networks`)
      .then(res => {
        this.$emit("loaded");
        this.apiResponse = res.data;
        this.loading = false;
      })
      .catch(() => {});
    this.loadCurrentConfig();
  },
  methods: {
    sendDone: function() {
      const wifi = {};
      wifi.ssid = this.computedSsid;
      if (
        (typeof this.ssid_select === "object" &&
          this.ssid_select.encryption !== "Open") ||
        this.ssid_select === "other"
      ) {
        wifi.password = this.password;
      }

      if (this.manualAccessPoint) {
        wifi.bssid = this.bssid;
        wifi.channel = this.channel;
      }

      if (this.staticIP) {
        wifi.ip = this.ip;
        wifi.mask = this.mask;
        wifi.gw = this.gw;
        if (this.dns1) wifi.dns1 = this.dns1;
        if (this.dns2) wifi.dns2 = this.dns2;
      }

      this.$emit("wifiConfig", wifi);
      this.$emit("done");
    },
    loadCurrentConfig: function() {
      if (this.currentConfig) {
        if (this.currentConfig.ssid) {
          this.ssid_select = "other";
          this.ssid_input = this.currentConfig.ssid;
          this.password = this.currentConfig.password || KEEP;
          if (this.password === KEEP) this.passwordClearText = true;
        }
        this.bssid = this.currentConfig.bssid;
        this.channel = this.currentConfig.channel;
        if (this.bssid) this.manualAccessPoint = true;
        this.ip = this.currentConfig.ip;
        this.mask = this.currentConfig.mask;
        this.gw = this.currentConfig.gw;
        this.dns1 = this.currentConfig.dns1;
        this.dns2 = this.currentConfig.dns2;
        if (this.ip) this.staticIP = true;
      }
    }
  }
};
</script>
