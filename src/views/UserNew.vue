<template>
  <div class="new-user">

    <Breadcrumb :trail="trail" />
    
    <b-card border-variant="dark" header-bg-variant="light" header="New User" class="m-2">
      <b-card-text>
        <FormUser 
          :key="formKey"
          :user="user"
          :showPass="true" 
          :enabled="true"
          @editEmail="editEmail"
          @deleteEmail="deleteEmail"
          @editPhone="editPhone"
          @deletePhone="deletePhone"
          @addEmail="addEmail"
          @addPhone="addPhone"
          @rolesChanged="rolesChanged"
        />
        <b-button class="my-2" variant="outline-success" @click="saveUser">
          Save
          <b-icon icon="check"></b-icon>
        </b-button>
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
import FormUser from '@/components/FormUser'
import Breadcrumb from '@/components/Breadcrumb'
import { RemoveBlanks } from '../lib/RemoveBlanks'
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import { FlashHandler } from '../lib/flash-handler'
import { FullName } from '../lib/fullname'

export default {
  components: {
    FormUser,
    Breadcrumb
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    formKey: 0,
    trail: [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'Users',
        href: '/users'
      },
      {
        text: 'New User',
        href: '/users/new'
      }
    ],
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
    }
  }),
  methods: {
    async bConfirm(message) {
      return await this.$bvModal.msgBoxConfirm(message)
    },
    editEmail(event) {
      this.editor.email = JSON.parse(JSON.stringify(event.email))
      this.editor.indices.email = event.index
      this.$refs['edit-email-modal'].show()
    },
    async deleteEmail(event) {
      if (await this.bConfirm(`Delete email: ${event.email.Address}?`)) {
        this.user.Emails.splice(event.index,1)
      }
    },
    editPhone(event) {
      this.editor.phone = JSON.parse(JSON.stringify(event.phone))
      this.editor.indices.phone = event.index
      this.$refs['edit-phone-modal'].show()
    },
    async deletePhone(event) {
      if (await this.bConfirm(`Delete phone: ${event.phone.Number}?`)) {
        this.user.Phones.splice(event.index,1)
      }
    },
    emailOK(event) {
      event.preventDefault()
      this.user.Emails[this.editor.indices.email] = this.editor.email
      this.$nextTick(() => {
        this.$bvModal.hide('edit-email-modal')
        this.formKey += 1
      })
    },
    phoneOK(event) {
      event.preventDefault()
      this.user.Phones[this.editor.indices.phone] = this.editor.phone
      this.$nextTick(() => {
        this.$bvModal.hide('edit-phone-modal')
        this.formKey += 1
      })
    },
    addEmail(event) {
      this.user.Emails.push(event)
    },
    addPhone(event) {
      this.user.Phones.push(event)
    },
    async saveUser() {
      this.$store.dispatch('loader/show')
      const payload = RemoveBlanks(this.user);
      try {
        const results = await this.api.postData('register', payload, buildHeaders({}))
        this.flash.success(`Registered User: ${FullName(results.Name)}`)
        setTimeout(() => {
          this.$router.push(`/users/${results.UUID}`);
        }, 500)
      } catch(e) {
        this.flash.error(e.message)
      }
      this.$store.dispatch('loader/hide')
    },
    rolesChanged(event) {
      this.user.Roles = []
      for (let Name of event) {
        this.user.Roles.push({ Name })
      }
    }
  },
  mounted() {
    this.flash.setStore(this.$store)
  }
}
</script>