<template>
  <div class="user-detail">

    <Breadcrumb :trail="trail" />

    <b-card border-variant="dark" header-bg-variant="light" header="Edit User" class="m-2">
      <b-card-text>
        <FormUser 
          :key="formKey"
          :user="user"
          :showPass="false" 
          :enabled="session.signedIn"
          @editEmail="editEmail"
          @deleteEmail="deleteEmail"
          @editPhone="editPhone"
          @deletePhone="deletePhone"
          @addEmail="addEmail"
          @addPhone="addPhone"
          @rolesChanged="rolesChanged"
        />
        <b-row class="m-4">
          <b-col>
            <b-button v-if="session.signedIn" variant="outline-success" @click="updateUser">
              Update
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to update a user
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
    <b-modal 
      id="edit-email-modal"
      ref="edit-email-modal"
      title="Edit Email" 
      header-bg-variant="primary"
      ok-title="Update"
      @ok="emailOK"
    >
      <form ref="edit-email-form">
        <div class="m-4">
          <b-input-group prepend="Address">
            <b-form-input v-model="editor.email.Address" type="email"></b-form-input>
          </b-input-group>
        </div>
        <div class="m-4">
          <b-form-group label="Usage">
            <b-form-radio value="Personal" v-model="editor.email.Usage" name="email-usage">
              Personal
            </b-form-radio>
            <b-form-radio value="Business" v-model="editor.email.Usage" name="email-usage">
              Business
            </b-form-radio>
          </b-form-group>
        </div>
        <div class="m-4">
          <b-form-group label="Display">
            <b-form-checkbox
              id="email-public"
              v-model="editor.email.Public"
              name="email-public"
              :value="true"
              :unchecked-value="false"
            >
              Public
            </b-form-checkbox>
          </b-form-group>
        </div>
      </form>
    </b-modal>
    <b-modal 
      id="edit-phone-modal"
      ref="edit-phone-modal"
      title="Edit Phone" 
      header-bg-variant="primary"
      ok-title="Update"
      @ok="phoneOK"
    >
      <form ref="edit-phone-form">
        <div class="m-4">
          <b-input-group prepend="Number">
            <b-form-input v-model="editor.phone.Number"></b-form-input>
          </b-input-group>
        </div>
        <div class="m-4">
          <b-form-group label="Type">
            <b-form-radio value="Cellular" v-model="editor.phone.Type" name="phone-type">
              Cellular
            </b-form-radio>
            <b-form-radio value="LandLine" v-model="editor.phone.Type" name="phone-type">
              LandLine
            </b-form-radio>
          </b-form-group>
        </div>
        <div class="m-4">
          <b-form-group label="Usage">
            <b-form-radio value="Personal" v-model="editor.phone.Usage" name="phone-usage">
              Personal
            </b-form-radio>
            <b-form-radio value="Business" v-model="editor.phone.Usage" name="phone-usage">
              Business
            </b-form-radio>
          </b-form-group>
        </div>
        <div class="m-4">
          <b-form-group label="Display">
            <b-form-checkbox
              id="phone-public"
              v-model="editor.phone.Public"
              name="phone-public"
              :value="true"
              :unchecked-value="false"
            >
              Public
            </b-form-checkbox>
          </b-form-group>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import FormUser from '@/components/FormUser'
import Breadcrumb from '@/components/Breadcrumb'
import { FullName } from '../lib/fullname'
import { FlashHandler } from '../lib/flash-handler'
import { RoleArray } from '../lib/options'

export default {
  components: {
    FormUser,
    Breadcrumb
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'Users',
        href: '/users'
      }
    ],
    formKey: 0,
    uuid: null,
    initial: {},
    user: {
      Name: {
        First: '',
        Middle: '',
        Last: ''
      },
      Credentials: {
        Username: '',
        Password: ''
      },
      Phones: [],
      Emails: [],
      Roles: []
    },
    fullName: '',
    editor: {
      phone: {
        Number: '',
        Type: 'Cellular',
        Usage: 'Personal',
        Public: false
      },
      email: {
        Address: '',
        Usage: 'Personal',
        Public: false
      },
      indices: {
        email: null,
        phone: null
      }
    },
    RoleArray
  }),
  methods: {
    async bConfirm(message) {
      return await this.$bvModal.msgBoxConfirm(message)
    },
    async getUser() {
      this.$store.dispatch('loader/show')
      const results = await this.api.getData(`user/${this.uuid}`, {}, buildHeaders({}))
      this.initial = results
      this.user = results
      this.formKey += 1
      if (this.trail.length == 2) {
        this.trail.push({
          text: FullName(results.Name),
          href: `/users/${this.uuid}`
        })
      }
      this.$store.dispatch('loader/hide')
    },
    editEmail(event) {
      this.editor.email = JSON.parse(JSON.stringify(event.email))
      this.editor.indices.email = event.index
      this.$refs['edit-email-modal'].show()
    },
    async deleteEmail(event) {
      if (await this.bConfirm(`Delete email: ${event.email.Address}?`)) {
        this.$store.dispatch('loader/show')
        try {
          await this.api.deleteData(`email/${event.email.UUID}`, {}, buildHeaders(this.session))
        } catch(e) {
          this.flash.error(`Error: ${e.message} deleting email`)
        }
        this.user.Emails.splice(event.index,1)
        this.$store.dispatch('loader/hide')
      }
    },
    editPhone(event) {
      this.editor.phone = JSON.parse(JSON.stringify(event.phone))
      this.editor.indices.phone = event.index
      this.$refs['edit-phone-modal'].show()
    },
    async deletePhone(event) {
      if (await this.bConfirm(`Delete phone: ${event.phone.Number}?`)) {
        this.$store.dispatch('loader/show')
        try {
          await this.api.deleteData(`phone/${event.phone.UUID}`, {}, buildHeaders(this.session))
        } catch(e) {
          this.flash.error(`Error: ${e.message} deleting email`)
        }
        this.user.Phones.splice(event.index,1)
        this.$store.dispatch('loader/hide')
      }
    },
    async addEmail(event) {
      this.$store.dispatch('loader/show')
      try {
        const results = await this.api.postData(`user/${this.uuid}/email`, event, buildHeaders(this.session))
        this.user.Emails.push(results)
      } catch(e) {
        this.flash.error(`Error: ${e.message} saving email`)
      }
      this.$store.dispatch('loader/hide')
    },
    async addPhone(event) {
      this.$store.dispatch('loader/show')
      try {
        const results = await this.api.postData(`user/${this.uuid}/phone`, event, buildHeaders(this.session))
        this.user.Phones.push(results)
      } catch(e) {
        this.flash.error(`Error: ${e.message} saving phone`)
      }
      this.$store.dispatch('loader/hide')
    },
    async emailOK(event) {
      event.preventDefault()
      this.$store.dispatch('loader/show')
      try {
        await this.api.patchData(`email/${this.editor.email.UUID}`, this.editor.email, buildHeaders(this.session))
      } catch(e) {
        this.flash.error(`Error: ${e.message} updating email`)
      }
      this.$store.dispatch('loader/hide')
      this.user.Emails[this.editor.indices.email] = this.editor.email
      this.$nextTick(() => {
        this.$bvModal.hide('edit-email-modal')
        this.formKey += 1
      })
    },
    async phoneOK(event) {
      event.preventDefault()
      this.$store.dispatch('loader/show')
      try {
        await this.api.patchData(`phone/${this.editor.phone.UUID}`, this.editor.phone, buildHeaders(this.session))
      } catch(e) {
        this.flash.error(`Error: ${e.message} updating phone`)
      }
      this.$store.dispatch('loader/hide')
      this.user.Phones[this.editor.indices.phone] = this.editor.phone
      this.$nextTick(() => {
        this.$bvModal.hide('edit-phone-modal')
        this.formKey += 1
      })
    },
    async updateUser() {
      this.$store.dispatch('loader/show')
      let payload = JSON.parse(JSON.stringify(this.user))
      delete payload.Emails
      delete payload.Phones
      delete payload.Roles
      try {
        await this.api.patchData(`user/${this.uuid}`, payload, buildHeaders(this.session))
      } catch(e) {
        this.flash.error(`Error: ${e.message} updating phone`)
      }
      this.getUser()
    },
    async rolesChanged(event) {
      // in theory each event will be one change
      let toAdd = [], 
          toRemove = []
      let current = this.user.Roles.map( r => r.Name )
      for (let role of this.RoleArray) {
        if (current.includes(role) && !event.includes(role)) {
          toRemove.push(role)
        }
        if (event.includes(role) && !current.includes(role)) {
          toAdd.push(role)
        }
      }
      // remove first
      let idx, role
      if (toRemove.length) {
        for (let name of toRemove) {
          role = this.user.Roles.find(r =>r.Name == name)
          await this.api.deleteData(`role/${role.UUID}`, {}, buildHeaders(this.session))
          idx = this.user.Roles.findIndex(r => r.Name == name)
          if (idx > -1) this.user.Roles.splice(idx,1)
        }
      }
      // add new roles
      let newRole
      if (toAdd.length) {
        for (let role of toAdd) {
          newRole = await this.api.postData(`user/${this.uuid}/role`, { Name: role }, buildHeaders(this.session))
          this.user.Roles.push(newRole)
        }
      }
    }
  },
  created() {
    this.uuid = this.$route.params.uuid;
    this.getUser()
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