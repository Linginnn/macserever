<template>
  <n-message-provider>
    <get-mac />
  </n-message-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NMessageProvider } from 'naive-ui';
import GetMac from './components/GetMac.vue';
export default defineComponent({
  name: 'App',
  components: {
    GetMac,
    NMessageProvider,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
