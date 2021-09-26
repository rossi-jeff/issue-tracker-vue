<template>
  <div>
    <b-card border-variant="dark" header-bg-variant="light" class="mx-2 mb-2" :header="user.Credentials.Username">

      <b-card-text>{{ name }}</b-card-text>

      <b-card-text>
        <b-row>
          <b-col>{{ user.Emails.length }} Email(s)</b-col>
          <b-col>{{ user.Phones.length }} Phone(s)</b-col>
          <b-col>Role(s): {{ user.Roles.map(u => u.Name).join(', ') }}</b-col>
        </b-row>
      </b-card-text>

      <b-button 
        variant="outline-primary"
        :to="{ name: 'UserDetail', params: { uuid: user.UUID } }"
        size="sm"
      >
        <b-icon icon="pencil-square"></b-icon>
        Edit
      </b-button>

    </b-card>
  </div>
</template>

<script>
import { FullName } from '@/lib/fullname'

export default {
  props: ['user'],
  data: () => ({
    name: ''
  }),
  mounted() {
    this.name = FullName(this.user.Name)
  }
}
</script>