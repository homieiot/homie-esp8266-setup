<template>
  <span style="display:inline-block;">
    <div class="tags has-addons">
      <span class="tag"><i class="icon is-small" v-if="icon" v-bind:class="[icon]"></i> <b>{{ label }}</b></span><span class="tag" v-bind:class="[colour]">{{ value }}</span>
    </div>
  </span>
</template>

<script>
export default {
  props: { label: {}, value: {}, icon: {}, colour: { default: "is-primary" } }
};
</script>
