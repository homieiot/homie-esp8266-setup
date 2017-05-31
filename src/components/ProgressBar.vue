<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="{ 'is-active': currentStep === 1 }"><a><i class="fa fa-heartbeat"></i> {{ currentStep === 1 ? 'Connection' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 2 }"><a><i class="fa fa-info"></i> {{ currentStep === 2 ? 'Information' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 3 }"><a><i class="fa fa-wifi"></i> {{ currentStep === 3 ? 'Wi-Fi' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 4 }"><a><i class="fa fa-signal"></i> {{ currentStep === 4 ? 'MQTT' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 5 }"><a><i class="fa fa-cogs"></i> {{ currentStep === 5 ? 'Settings' : '' }}</a></li>
      <li :class="{ 'is-active': currentStep === 6 }"><a><i class="fa fa-rocket"></i> {{ currentStep === 6 ? 'Launch' : '' }}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['currentStep']
}
</script>

<style scoped>
  .tabs a {
    cursor: default;
  }

  .tabs a:hover {
    border-bottom-color: #d3d6db;
    color: #69707a;
  }

  .tabs li.is-active a {
    border-bottom-color: #e74c3c;
    color: #e74c3c;
  }
</style>
