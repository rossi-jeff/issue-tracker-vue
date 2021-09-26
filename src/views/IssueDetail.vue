<template>
  <div class="issue-detail">

    <Breadcrumb :trail="trail" />

    <b-card border-variant="dark" header-bg-variant="light" header="Edit Issue" class="m-2">
      <b-card-text>
        <FormIssue :issue="issue" :enabled="session.signedIn" />
        <b-row class="m-4">
          <b-col>
            <b-button v-if="session.signedIn" variant="outline-success" @click="update">
              Update
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to update an issue
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>

    <div v-if="session.signedIn">
      <b-card no-body border-variant="dark" header-bg-variant="light" class="m-2" header-tag="header">

        <template #header>
          <h6 class="mb-0" style="cursor: pointer" @click="commentFormVisible = !commentFormVisible">Add Comment</h6>
        </template>

        <b-collapse v-model="commentFormVisible" id="form-comment-collapse">
          <FormComment :comment="comment" />
          <b-row class="m-4">
            <b-col>
              <b-button variant="outline-success" @click="saveComment">
                Save
                <b-icon icon="check"></b-icon>
              </b-button>
            </b-col>
          </b-row>
          
        </b-collapse>

      </b-card>
      <b-card no-body border-variant="dark" header-bg-variant="light" class="m-2" header-tag="header" v-if="issue.Comments">

        <template #header>
          <h6 class="mb-0" style="cursor: pointer" @click="commentListVisible = !commentListVisible">Comment List ({{ issue.Comments.length }})</h6>
        </template>

        <b-collapse v-model="commentListVisible" id="comment-list-collapse">
          <div class="m-4 comment-scroller">
            <CommentCard 
              v-for="comment of issue.Comments"
              :key="comment.Id"
              :comment="comment"
            />
          </div>
        </b-collapse>

      </b-card>
    </div>
  </div>
</template>

<script>
import FormIssue from '@/components/FormIssue'
import FormComment from '@/components/FormComment'
import CommentCard from '@/components/CommentCard'
import Breadcrumb from '@/components/Breadcrumb'
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import { FlashHandler } from '../lib/flash-handler'

export default {
  components: {
    FormIssue,
    FormComment,
    CommentCard,
    Breadcrumb
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'Issues',
        href: '/issues'
      }
    ],
    blank: {
      Title: '',
      Details: '',
      Type: '',
      Status: '',
      Priority: '',
      Complexity: '',
      AssignedToId: '',
      ProjectId: '',
      Comments: []
    },
    comment: {
      Title: '',
      Details: '',
    },
    commentFormVisible: false,
    commentListVisible: false,
    initial: {},
    issue: {},
    uuid: null,
  }),
  methods: {
    reset() {
      this.issue = JSON.parse(JSON.stringify(this.blank))
    },
    async loadIssue() {
      this.$store.dispatch('loader/show')
      const results = await this.api.getData(`issue/${this.uuid}`, {}, buildHeaders(this.session))
      this.initial = results
      this.issue = results
      if (this.trail.length == 2) {
        this.trail.push({
          text: results.Title,
          href: `/issues/${this.uuid}`
        })
      }
      this.$store.dispatch('loader/hide')
    },
    async saveComment() {
      this.$store.dispatch('loader/show')
      await this.api.postData(`issue/${this.uuid}/comment`, this.comment, buildHeaders(this.session))
      this.comment.Title = ''
      this.comment.Details = ''
      this.commentListVisible = true
      this.loadIssue()
    },
    async update() {
      this.$store.dispatch('loader/show')
      const payload = JSON.parse(JSON.stringify(this.issue))
      delete payload.Comments
      try {
        const results = await this.api.patchData(`issue/${this.uuid}`,payload, buildHeaders(this.session))
        this.flash.success(`Issue ${this.issue.Title} updated`)
        this.initial = results
        this.issue = results
      } catch (error) {
        this.flash.error(`Error: ${error.message} saving issue`)
      }
      this.$store.dispatch('loader/hide')
    }
  },
  created() {
    this.uuid = this.$route.params.uuid;
    this.reset()
    this.loadIssue()
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  },
  mounted() {
    this.flash.setStore(this.$store)
  }
}
</script>

<style>
.comment-scroller {
  max-height: 500px;
  overflow-y: auto;
}
</style>