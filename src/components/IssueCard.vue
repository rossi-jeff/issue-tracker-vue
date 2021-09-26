<template>
  <div>
    <b-card  border-variant="dark" header-bg-variant="light" class="mx-2 mb-2" :header="issue.Title">

      <b-card-text v-if="issue.Project">
        <b-row>
          <b-col>
            <strong class="mr-6">Project</strong>
            {{ issue.Project.Name }}
          </b-col>
        </b-row>
      </b-card-text>

      <b-card-text>
        <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="4" cols-xl="4">
          <b-col>
            <strong class="mr-6">Priority</strong>
            {{ issue.Priority }}
          </b-col>
          <b-col>
            <strong class="mr-6">Status</strong>
            {{ issue.Status }}
          </b-col>
          <b-col>
            <strong class="mr-6">Type</strong>
            {{ issue.Type }}
          </b-col>
          <b-col>
            <strong class="mr-6">Complexity</strong>
            {{ issue.Complexity }}
          </b-col>
        </b-row>
      </b-card-text>

      <b-card-text>{{ issue.Details }}</b-card-text>


      <b-card-text>
        <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="3" cols-xl="3">
          <b-col>
            <strong class="mr-6">Created</strong>
            {{ issue.Created }}
          </b-col>
          <b-col>
            <strong class="mr-6">Author</strong>
            {{ author }}
          </b-col>
          <b-col>
            <strong class="mr-6">Assigned To</strong>
            {{ assigned }}
          </b-col>
        </b-row>
      </b-card-text>

      <b-button 
        variant="outline-primary"
        :to="{ name: 'IssueDetail', params: { uuid: issue.UUID } }"
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
  props: ['issue'],
  data: () => ({
    author: '',
    assigned: ''
  }),
  mounted() {
    if (this.issue.Author && this.issue.Author.Name) {
      this.author = FullName(this.issue.Author.Name)
    }
    if (this.issue.AssignedTo && this.issue.AssignedTo.Name) {
      this.assigned = FullName(this.issue.AssignedTo.Name)
    }
  }
}
</script>