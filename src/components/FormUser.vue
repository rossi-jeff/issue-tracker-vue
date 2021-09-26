<template>
  <div>
    <div class="accordion" role="tablist">

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-2" role="tab">
          <b-button  v-b-toggle.credentials-panel style="width: 100%" variant="primary">Credentials</b-button>
        </b-card-header>
        <b-collapse id="credentials-panel" visible accordion="form-user" role="tabpanel">
          <b-row class="m-4" cols="1" cols-sm="1" cols-md="2" cols-lg="2" cols-xl="2">
            <b-col class="p-2">
              <b-input-group prepend="UserName">
                <b-form-input name="UserName" v-validate="'required|min:6'" v-model="user.Credentials.Username" :disabled="!enabled"></b-form-input>
              </b-input-group>
              <div class="vee-validate-error p-2">{{ errors.first('UserName') }}</div>
            </b-col>
            <b-col v-if="showPass" class="p-2">
              <b-input-group prepend="PassWord">
                <b-form-input name="PassWord" v-validate="'required|min:6'" v-model="user.Credentials.Password" type="password" :disabled="!enabled"></b-form-input>
              </b-input-group>
              <div class="vee-validate-error p-2">{{ errors.first('PassWord') }}</div>
            </b-col>
          </b-row>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-2" role="tab">
          <b-button style="width: 100%" variant="primary" v-b-toggle.name-panel>Name</b-button>
        </b-card-header>
        <b-collapse id="name-panel" accordion="form-user" role="tabpanel">
          <b-row class="m-4" cols="1" cols-sm="2" cols-md="3" cols-lg="3" cols-xl="3">
            <b-col class="p-2">
              <b-input-group prepend="First">
                <b-form-input name="First" v-validate="'required'" v-model="user.Name.First" :disabled="!enabled"></b-form-input>
              </b-input-group>
              <div class="vee-validate-error p-2">{{ errors.first('First') }}</div>
            </b-col>
            <b-col class="p-2">
              <b-input-group prepend="Middle">
                <b-form-input v-model="user.Name.Middle" :disabled="!enabled"></b-form-input>
              </b-input-group>
            </b-col>
            <b-col class="p-2">
              <b-input-group prepend="Last">
                <b-form-input name="Last" v-validate="'required'" v-model="user.Name.Last" :disabled="!enabled"></b-form-input>
              </b-input-group>
              <div class="vee-validate-error p-2">{{ errors.first('Last') }}</div>
            </b-col>
          </b-row>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-2" role="tab">
          <b-button style="width: 100%" variant="primary" v-b-toggle.email-panel>Email</b-button>
        </b-card-header>
        <b-collapse id="email-panel" accordion="form-user" role="tabpanel">
          <b-row class="m-4" cols="1" cols-sm="1" cols-md="2" cols-lg="4" cols-xl="4">
            <b-col align-self="end" class="p-2">
              <b-input-group prepend="Address">
                <b-form-input 
                  name="Address" 
                  v-validate="'required|email'" 
                  v-model="email.Address" 
                  type="email" 
                  :disabled="!enabled"
                ></b-form-input>
              </b-input-group>
              <div class="vee-validate-error p-2">{{ errors.first('Address') }}</div>
            </b-col>
            <b-col class="p-2">
              <b-form-group label="Usage">
                <b-form-radio value="Personal" v-model="email.Usage" name="email-usage" :disabled="!enabled">
                  Personal
                </b-form-radio>
                <b-form-radio value="Business" v-model="email.Usage" name="email-usage" :disabled="!enabled">
                  Business
                </b-form-radio>
              </b-form-group>
            </b-col>
            <b-col class="p-2">
              <b-form-group label="Display">
                <b-form-checkbox
                  id="email-public"
                  v-model="email.Public"
                  name="email-public"
                  :value="true"
                  :unchecked-value="false"
                  :disabled="!enabled"
                >
                  Public
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col align-self="end" class="p-2">
              <b-button variant="outline-primary" @click="addEmail" :disabled="!enabled">
                Add Email
                <b-icon icon="envelope"></b-icon>
              </b-button>
            </b-col>
          </b-row>
          <EmailTable 
            :emails="user.Emails"
            :enabled="enabled"
            @editEmail="editEmail"
            @deleteEmail="deleteEmail"
          />
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-2" role="tab">
          <b-button style="width: 100%" variant="primary" v-b-toggle.phone-panel>Phone</b-button>
        </b-card-header>
        <b-collapse id="phone-panel" accordion="form-user" role="tabpanel">
          <b-row class="m-4" cols="1" cols-sm="2" cols-md="3" cols-lg="5" cols-xl="5">
            <b-col align-self="end" class="p-2">
              <b-input-group prepend="Number">
                <b-form-input name="Number" v-validate="'required'" v-model="phone.Number" :disabled="!enabled"></b-form-input>
              </b-input-group>
              <div class="vee-validate-error p-2">{{ errors.first('Number') }}</div>
            </b-col>
            <b-col class="p-2">
              <b-form-group label="Type">
                <b-form-radio value="Cellular" v-model="phone.Type" name="phone-type" :disabled="!enabled">
                  Cellular
                </b-form-radio>
                <b-form-radio value="LandLine" v-model="phone.Type" name="phone-type" :disabled="!enabled">
                  LandLine
                </b-form-radio>
              </b-form-group>
            </b-col>
            <b-col class="p-2">
              <b-form-group label="Usage">
                <b-form-radio value="Personal" v-model="phone.Usage" name="phone-usage" :disabled="!enabled">
                  Personal
                </b-form-radio>
                <b-form-radio value="Business" v-model="phone.Usage" name="phone-usage" :disabled="!enabled">
                  Business
                </b-form-radio>
              </b-form-group>
            </b-col>
            <b-col class="p-2">
              <b-form-group label="Display">
                <b-form-checkbox
                  id="phone-public"
                  v-model="phone.Public"
                  name="phone-public"
                  :value="true"
                  :unchecked-value="false"
                  :disabled="!enabled"
                >
                  Public
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col align-self="end" class="p-2">
              <b-button variant="outline-primary" @click="addPhone" :disabled="!enabled">
                Add Phone
                <b-icon icon="phone"></b-icon>
              </b-button>
            </b-col>
          </b-row>
          <PhoneTable 
            :phones="user.Phones"
            :enabled="enabled"
            @editPhone="editPhone"
            @deletePhone="deletePhone"
          />
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-2" role="tab">
          <b-button style="width: 100%" variant="primary" v-b-toggle.role-panel>Role</b-button>
        </b-card-header>
        <b-collapse id="role-panel" accordion="form-user" role="tabpanel">
          <b-row class="m-4">
            <b-col>
              <b-form-checkbox-group
                id="user-role"
                name="user-role"
                v-model="roleCB"
                :options="RoleArray"
                @change="rolesChanged"
                :disabled="!enabled"
              ></b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  UsageArray,
  PhoneTypeArray,
  RoleArray
} from '../lib/options'
import EmailTable from '@/components/EmailTable'
import PhoneTable from '@/components/PhoneTable'
import { FlashHandler } from '../lib/flash-handler'


export default {
  props: ['user','showPass','enabled'],
  components: {
    EmailTable,
    PhoneTable
  },
  data: () => ({
    flash: new FlashHandler(),
    UsageArray,
    PhoneTypeArray,
    RoleArray,
    blank: {
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
    },
    phone: {},
    email: {},
    roleCB: []
  }),
  methods: {
    addEmail() {
      let error = this.errors.first('Address')
      if (error) {
        this.flash.error(error)
        return
      }
      this.$emit('addEmail', this.email)
      this.resetEmail()
      setTimeout(() => {
        const field = this.$validator.fields.find({ name: 'Address' })
        field.reset()
        this.$validator.errors.remove(field.name, field.scope);
      },100)
      
    },
    addPhone() {
      let error = this.errors.first('Number')
      if (error) {
        this.flash.error(error)
        return
      }
      this.$emit('addPhone', this.phone)
      this.resetPhone()
      setTimeout(() => {
        const field = this.$validator.fields.find({ name: 'Number' })
        field.reset()
        this.$validator.errors.remove(field.name, field.scope);
      }, 100)
    },
    rolesChanged() {
      this.$emit('rolesChanged', this.roleCB)
    },
    resetEmail() {
      this.email = JSON.parse(JSON.stringify(this.blank.email))
    },
    resetPhone() {
      this.phone = JSON.parse(JSON.stringify(this.blank.phone))
    },
    checkRoles() {
      this.roleCB = []
      for (let role of this.user.Roles) {
        this.roleCB.push(role.Name)
      }
    },
    editEmail(event) {
      this.$emit('editEmail', event)
    },
    deleteEmail(event) {
      this.$emit('deleteEmail', event)
    },
    editPhone(event) {
      this.$emit('editPhone', event)
    },
    deletePhone(event) {
      this.$emit('deletePhone', event)
    }
  },
  created() {
    this.resetEmail()
    this.resetPhone()
    this.checkRoles()
  },
  mounted() {
    this.flash.setStore(this.$store)
  }
}
</script>

<style>
.custom-radio, .custom-checkbox {
  display: inline-block;
  margin-right: 1em;
}
input[type=radio], input[type=checkbox] {
  margin-right: 0.5em;
}
.email-table, .phone-table {
  margin: 0.5em 3em 0.5em 3em;
}
.header-row {
  background-color: #e9ecef;
  font-weight: bold;
}
.content-row {
  border-bottom: solid 1px #e9ecef;
}
</style>