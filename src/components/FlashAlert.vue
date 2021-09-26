<template>
  <div>
    <b-alert 
      class="m-2" 
      :show="alert.visible" 
      :variant="alert.variant"
    >
      {{ alert.message }}
    </b-alert>
  </div>
</template>

<script>
export default {
  computed: {
    alert() {
			return this.$store.state.alert;
		},
  },
}
</script>