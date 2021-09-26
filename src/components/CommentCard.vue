<template>
  <div>
    <b-card border-variant="dark" header-bg-variant="light" :header="comment.Title" class="m-2">

      <b-card-text>{{ comment.Details}}</b-card-text>

      <b-card-text>
        Author: {{ name }}<br/>
        Created: {{ comment.Created }}
      </b-card-text>

    </b-card>
  </div>
</template>

<script>
import { FullName } from '../lib/fullname'
export default {
  props: ['comment'],
  data: () => ({
    name: ''
  }),
  created() {
    if (this.comment.Author) {
      this.name = FullName(this.comment.Author.Name)
    }
  }
}
</script>