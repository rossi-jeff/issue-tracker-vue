<template>
  <div class="home">

    <Breadcrumb :trail="trail" />

    <b-card border-variant="dark" header-bg-variant="light" header="Flash Alert Test" class="m-2">
      <b-card-text>
        <b-button class="mx-1" variant="success" @click="showSuccess">
          success
        </b-button>
        <b-button class="mx-1" variant="info" @click="showInfo">
          info
        </b-button>
        <b-button class="mx-1" variant="danger" @click="showError">
          danger
        </b-button>
        <b-button class="mx-1" @click="clear">
          clear
        </b-button>
      </b-card-text>
    </b-card>

    
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { FlashHandler } from '../lib/flash-handler'

export default {
  name: 'Home',
  components: {
    Breadcrumb
  },
  data: () => ({
    flash: new FlashHandler(),
    trail: [
      {
        text: 'Home',
        href: '/'
      }
    ]
  }),
  methods: {
    showInfo() {
      this.flash.info('example info message')
    },
    showSuccess() {
      this.flash.success('example success message')
    },
    showError() {
      this.flash.error('example error message')
    },
    clear() {
      this.flash.clear()
    }
  },
  mounted() {
    this.flash.setStore(this.$store)
  }
}
</script>