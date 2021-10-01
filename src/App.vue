<template>
  <b-overlay id="loader" spinner-variant="primary" :show="loader.visible">
    <div id="app">
      <TopBar />
      <FlashAlert />
      <router-view />
    </div>
  </b-overlay>
</template>

<script>
import TopBar from "@/components/TopBar";
import FlashAlert from "@/components/FlashAlert";

export default {
  components: {
    TopBar,
    FlashAlert
  },
  computed: {
    loader() {
      return this.$store.state.loader;
    }
  },
  watch: {
    $route() {
      this.$store.dispatch("loader/hide");
    }
  }
};
</script>

<style>
#app {
  margin-top: 5em;
}

.vee-validate-error {
  color: red;
  font-weight: bold;
}

input[aria-invalid="true"] {
  border-color: red;
}
</style>
