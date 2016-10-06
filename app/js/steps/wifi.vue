<template>
  <span v-if="!loading">
    <p>
      Select the Wi-Fi network to connect to:
    </p>

    <form v-on:submit.prevent="sendDone">
      <label class="label" for="wifi_network">Network</label>
      <p class="control">
        <span class="select">
          <select v-model="ssid_select" id="wifi_network">
            <option value="select">Select...</option>
            <option v-for="network in formattedNetworks" v-bind:value="network">
              {{ network.ssid }} - {{ network.encryption }} ({{ network.signalQuality }}%)
            </option>
            <option value="other">Other/hidden network</option>
          </select>
        </span>
      </p>

      <div v-if="ssid_select === 'other'">
        <label class="label" for="wifi_ssid">Wi-Fi SSID</label>
        <p class="control">
          <input class="input" v-model="ssid_input" id="wifi_ssid" type="text" placeholder="SSID" maxLength="32" required />
          <span class="help">Required.</span>
        </p>
      </div>

      <div v-if="typeof ssid_select === 'object' && ssid_select.encryption !== 'Open' || ssid_select === 'other'">
        <label class="label" for="wifi_password">Wi-Fi password</label>
        <p class="control is-grouped">
          <input class="input" v-model="password" v-bind:type="passwordClearText ? 'text' : 'password'" id="wifi_password" placeholder="Password" maxLength="64" />
          <label class="checkbox">
            <input type="checkbox" v-model="passwordClearText" /> Show password
          </label>
        </p>
        <span class="help">Optional. Leave blank if open network.</span>
        <br/>
      </div>

      <p class="control">
        <button type="submit" v-bind:disabled="!formIsValid" class="button is-primary">Next</button>
      </p>
    </form>
  </span>
</template>

<script>
import axios from 'axios'
import {API_URL} from '../constants'

export default {
  data () {
    return {
      loading: true,
      apiResponse: null,
      ssid_select: 'select',
      ssid_input: null,
      password: null,
      passwordClearText: false
    }
  },
  computed: {
    formattedNetworks: function () {
      let networks = this.apiResponse.networks.slice(0)
      networks.sort(function (networkA, networkB) {
        if (networkA.rssi > networkB.rssi) {
          return -1
        } else if (networkA.rssi < networkB.rssi) {
          return 1
        } else {
          return 0
        }
      })

      networks = networks.map(function (network) {
        if (network.rssi <= -100) {
          network.signalQuality = 0
        } else if (network.rssi >= -50) {
          network.signalQuality = 100
        } else {
          network.signalQuality = 2 * (network.rssi + 100)
        }

        switch (network.encryption) {
          case 'wep':
            network.encryption = 'WEP'
            break
          case 'wpa':
            network.encryption = 'WPA'
            break
          case 'wpa2':
            network.encryption = 'WPA2'
            break
          case 'none':
            network.encryption = 'Open'
            break
          case 'auto':
            network.encryption = 'Automatic'
            break
        }
        return network
      })

      return networks
    },
    computedSsid: function () {
      let ssid;
      if (typeof this.ssid_select === 'object') return this.ssid_select.ssid
      else if (this.ssid_select === 'other') return this.ssid_input

      return null
    },
    formIsValid: function () {
      const needPassword = typeof this.ssid_select === 'object' && this.ssid_select.encryption !== 'Open'

      return this.computedSsid && (!needPassword || this.password)
    }
  },
  mounted () {
    this.$emit('loading', 'Gathering available Wi-Fi networks...')
    axios.get(`${API_URL}/networks`).then((res) => {
      this.$emit('loaded')
      this.apiResponse = res.data
      this.loading = false
    }).catch((err) => {
    })
  },
  methods: {
    sendDone: function () {
      this.$emit('wifiConfig', {
        ssid: this.computedSsid,
        password: typeof this.ssid_select === 'object' && this.ssid_select.encryption === 'Open' ? null : this.password
      })

      this.$emit('done')
    }
  }
}
</script>
