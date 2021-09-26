<template>
  <div>
    <b-navbar class="px-4" type="light" variant="info" fixed="top" toggleable="lg">

      <b-navbar-brand to="/">
         <span class="h3">Issue Tracker</span> 
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ms-auto">  

          <b-nav-item-dropdown id="menu" text="menu" variant="info" class="m-md-2 mr-2">
            <b-dropdown-item to="/projects">Projects</b-dropdown-item>
            <b-dropdown-item to="/issues">Issues</b-dropdown-item>
            <b-dropdown-item to="/users">Users</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-button v-b-modal.login-modal v-if="!session.signedIn" variant="info" size="sm">
            <b-icon icon="box-arrow-in-right"></b-icon>
            Login
          </b-button>
          <b-button variant="info" @click="logout" v-if="session.signedIn">
            Logout
            <b-icon icon="box-arrow-right"></b-icon>
          </b-button>

        </b-navbar-nav>
      </b-collapse>

    </b-navbar>
    <b-modal 
      id="login-modal" 
      title="Login" 
      header-bg-variant="primary"
      @ok="handleOk"
      ok-title="Login"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit"> 
        <div class="m-4">
          <b-input-group prepend="UserName">
            <b-form-input name="UserName" v-validate="'required|min:6'" v-model="payload.Username" required></b-form-input>
            <b-input-group-append>
              <b-input-group-text>
                <b-icon icon="person"></b-icon>
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
          <div class="vee-validate-error p-1">{{ errors.first('UserName') }}</div>
        </div>
        <div class="m-4">
          <b-input-group prepend="PassWord">
            <b-form-input name="PassWord" v-validate="'required|min:6'" v-model="payload.Password" type="password" required></b-form-input>
            <b-input-group-append>
              <b-input-group-text>
                <b-icon icon="lock"></b-icon>
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
          <div class="vee-validate-error p-1">{{ errors.first('PassWord') }}</div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import { FlashHandler } from '../lib/flash-handler'

export default {
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    payload: {
      Username: '',
      Password: ''
    }
  }),
  methods: {
    handleSubmit() {
      const valid = this.$refs.form.checkValidity()
      if (!valid) return
      this.send()
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    async send() {
      try {
        const results = await this.api.postData('auth/login', this.payload, buildHeaders({}))
        await this.$store.dispatch('session/loginSuccess', results)
        this.flash.success(`Logged in as ${results.Name}`)
        this.payload.Username = ''
        this.payload.Password = ''
        this.$nextTick(() => {
          this.$bvModal.hide('login-modal')
        })
      } catch (e) {
        await this.$store.dispatch('session/logout')
        this.flash.error('Unauthorized Error')
      }
    },
    async logout() {
      if (confirm('Are you sure you wan to logout?')) {
        if (this.session.SessionId) {
          try {
            await this.api.deleteData(`auth/${this.session.SessionId}`, {}, buildHeaders(this.session))
          } catch (e)  {
            console.log(e)
          }
        }
        await this.$store.dispatch('session/logout')
        this.flash.info('Logout Successful')
      }
    }
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  },
  mounted() {
    this.flash.setStore(this.$store)
  }
}
</script>