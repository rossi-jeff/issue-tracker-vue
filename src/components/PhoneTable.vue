<template>
  <div v-if="phones.length" class="phone-table">
    <b-row class="header-row p-2" cols="1" cols-sm="2" cols-md="3" cols-lg="6" cols-xl="6">
      <b-col></b-col>
      <b-col>Number</b-col>
      <b-col>Type</b-col>
      <b-col>Usage</b-col>
      <b-col>Display</b-col>
      <b-col></b-col>
    </b-row>
    <PhoneTableRow
      v-for="(phone,index) of phones"
      :key="index"
      :phone="phone"
      :index="index"
      :enabled="enabled"
      @editPhone="editPhone"
      @deletePhone="deletePhone"
      class="content-row p-2" 
    />
  </div>
</template>

<script>
import PhoneTableRow from './PhoneTableRow'
export default {
  props: ['phones','enabled'],
  components: {
    PhoneTableRow
  },
  methods: {
    editPhone(index) {
      let phone = this.phones[index]
      this.$emit('editPhone', { phone, index })
    },
    deletePhone(index) {
      let phone = this.phones[index]
      this.$emit('deletePhone', { phone, index })
    }
  }
}
</script>