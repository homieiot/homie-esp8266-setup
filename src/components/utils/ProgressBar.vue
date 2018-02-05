<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="{ 'is-active': currentStep === 1 }"><a><span class="icon"><heart-pulse-icon /></span> {{ currentStep === 1 ? 'Connection' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 2 }"><a><span class="icon"><info-icon /></span> {{ currentStep === 2 ? 'Information' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 3 }"><a><span class="icon"><wifi-icon /></span> {{ currentStep === 3 ? 'Wi-Fi' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 4 }"><a><span class="icon"><signal-icon /></span> {{ currentStep === 4 ? 'MQTT' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 5 }"><a><span class="icon"><tune-icon /></span> {{ currentStep === 5 ? 'Settings' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 6 }"><a><span class="icon"><rocket-icon /></span> {{ currentStep === 6 ? 'Launch' : '' }}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["currentStep"]
};
</script>

<style lang="scss" scoped>
@import "../variables";

.tabs a {
  cursor: default;
  height: 24px;
}
</style>
