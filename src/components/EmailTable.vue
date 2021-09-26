<template>
  <div v-if="emails.length" class="email-table">
    <b-row class="header-row p-2" cols="1" cols-sm="2" cols-md="3" cols-lg="5" cols-xl="5">
      <b-col></b-col>
      <b-col>Address</b-col>
      <b-col>Usage</b-col>
      <b-col>Display</b-col>
      <b-col></b-col>
    </b-row>
    <EmailTableRow
      v-for="(email,index) of emails"
      :key="index"
      :index="index"
      :email="email"
      :enabled="enabled"
      @editEmail="editEmail"
      @deleteEmail="deleteEmail"
      class="content-row p-2" 
    />
  </div>
</template>

<script>
import EmailTableRow from './EmailTableRow'

export default {
  props: ['emails','enabled'],
  components: {
    EmailTableRow
  },
  methods: {
    editEmail(index) {
      let email = this.emails[index]
      this.$emit('editEmail', { email, index })
    },
    deleteEmail(index) {
      let email = this.emails[index]
      this.$emit('deleteEmail', { email, index })
    }
  }
}
</script>