<template>
  <div class="new-issue">

    <Breadcrumb :trail="trail" />
    
    <b-card border-variant="dark" header-bg-variant="light" header="New Issue" class="m-2">
      <b-card-text>
        <FormIssue :issue="issue" :enabled="session.signedIn" />
        <b-row class="m-4">
          <b-col>
            <b-button v-if="session.signedIn" variant="outline-success" @click="save">
              Save
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to create an issue
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import FormIssue from '@/components/FormIssue'
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import { RemoveBlanks } from '../lib/RemoveBlanks'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    FormIssue,
    Breadcrumb
  },
  data: () => ({
    api: new ApiFetch(),
    trail: [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'Issues',
        href: '/issues'
      },
      {
        text: 'New Issue',
        href: '/issues/new'
      }
    ],
    blank: {
      Title: '',
      Details: '',
      Type: '',
      Status: 'New',
      Priority: '',
      Complexity: '',
      AssignedToId: ''
    },
    issue: {}
  }),
  methods: {
    reset() {
      this.issue = JSON.parse(JSON.stringify(this.blank))
    },
    async save() {
      this.$store.dispatch('loader/show')
      const payload = RemoveBlanks(this.issue)
      const result = await this.api.postData('issue', payload, buildHeaders(this.session))
      setTimeout(() => {
        this.$router.push(`/issues/${result.UUID}`);
      }, 500);
      this.$store.dispatch('loader/hide')
    }
  },
  created() {
    this.reset()
    console.log(this.session)
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  }
}
</script>