<template>
  <div>
    <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="6" cols-xl="6">
      <b-col>
        <b-button variant="outline-info" @click="editPhone" :disabled="!enabled">
          <b-icon icon="pencil-square"></b-icon>
          Edit
        </b-button>
      </b-col>
      <b-col>{{ phone.Number }}</b-col>
      <b-col>{{ phone.Type }}</b-col>
      <b-col>{{ phone.Usage }}</b-col>
      <b-col>{{ phone.Public ? 'Yes' : 'No'  }}</b-col>
      <b-col>
        <b-button variant="outline-danger" @click="deletePhone" :disabled="!enabled">
          Delete
          <b-icon icon="trash"></b-icon>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ['phone','index','enabled'],
  methods: {
    editPhone() {
      this.$emit('editPhone', this.index)
    },
    deletePhone() {
      this.$emit('deletePhone', this.index)
    }
  }
}
</script>