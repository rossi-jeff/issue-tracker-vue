<template>
  <div>
    <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="5" cols-xl="5">
      <b-col>
        <b-button variant="outline-info" @click="editEmail" :disabled="!enabled">
          <b-icon icon="pencil-square"></b-icon>
          Edit
        </b-button>
      </b-col>
      <b-col>{{ email.Address }}</b-col>
      <b-col>{{ email.Usage }}</b-col>
      <b-col>{{ email.Public ? 'Yes' : 'No' }}</b-col>
      <b-col class="text-end">
        <b-button variant="outline-danger" @click="deleteEmail" :disabled="!enabled">
          Delete
          <b-icon icon="trash"></b-icon>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ['email','index','enabled'],
  methods: {
    editEmail() {
      this.$emit('editEmail', this.index)
    },
    deleteEmail() {
      this.$emit('deleteEmail', this.index)
    }
  }
}
</script>