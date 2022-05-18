<template>
<div>
  <b-card border-variant="dark" header-bg-variant="light" class="mx-2 mb-2" :header="user.Credentials.Username">

    <b-card-text>{{ name }}</b-card-text>

    <b-card-text>
      <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="3" cols-xl="3">
        <b-col>{{ user.Emails.length }} Email(s)</b-col>
        <b-col>{{ user.Phones.length }} Phone(s)</b-col>
        <b-col>Role(s): {{ user.Roles.join(', ') }}</b-col>
      </b-row>
    </b-card-text>

    <b-button variant="outline-primary" :to="{ name: 'UserDetail', params: { uuid: user.UUID } }" size="sm">
      <b-icon icon="pencil-square"></b-icon>
      Edit
    </b-button>

    <b-button variant="outline-danger" size="sm" class="float-end" v-if="session.signedIn" @click="deleteClicked">
      Delete
      <b-icon icon="trash"></b-icon>
    </b-button>

  </b-card>
</div>
</template>

<script>
import {
  FullName
} from '@/lib/fullname'

export default {
  props: ['user', 'session'],
  data: () => ({
    name: ''
  }),
  methods: {
    deleteClicked() {
      const {
        UUID
      } = this.user;
      this.$emit("deleteClicked", UUID);
    }
  },
  mounted() {
    this.name = FullName(this.user.Name)
  }
}
</script>
