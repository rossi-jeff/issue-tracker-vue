<template>
  <div class="issues">

    <Breadcrumb :trail="trail" />
    
    <b-card header="Issues" border-variant="dark" header-bg-variant="light" class="m-2">

      <b-card-text>

        <b-button v-b-toggle.issue-filters size="sm" variant="outline-primary" class="mx-2">
          <b-icon icon="filter"/>
          Filters
        </b-button>
        <b-button v-b-toggle.issue-search size="sm" variant="outline-info" class="mx-2">
          <b-icon icon="search"/>
          Search
        </b-button>
        <b-button to="/issues/new" size="sm" variant="outline-success" class="mx-2">
          <b-icon icon="plus-circle"></b-icon>
          New Issue
        </b-button>
        <strong class="mx-2">Showing:</strong>
        {{ count }}

        <b-collapse id="issue-search" class="mx-2 my-4">
          <b-input-group>
            <b-form-input v-model="Term" placeholder="Enter Search Term..."></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-info">
                Search
                 <b-icon icon="search"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-collapse>

        <b-collapse id="issue-filters" class="mx-2 my-4">
          <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="9" cols-xl="9">
            <b-col>
              <div>
                <strong>Priority</strong>
              </div>
              <b-form-select
                v-model="Priority" 
                :options="PriorityArray"
                @change="updateFilters"
                style="width: 90%"
              ></b-form-select>
            </b-col>
            <b-col>
              <div>
                <strong>Status</strong>
              </div>
              <b-form-select 
                v-model="Status" 
                :options="StatusArray"
                @change="updateFilters"
                style="width: 90%"
              ></b-form-select>
            </b-col>
            <b-col>
              <div>
                <strong>Type</strong>
              </div>
              <b-form-select 
                v-model="Type" 
                :options="IssueTypeArray"
                @change="updateFilters"
                style="width: 90%"
              ></b-form-select>
            </b-col>
            <b-col>
              <div>
                <strong>Complexity</strong>
              </div>
              <b-form-select 
                v-model="Complexity" 
                :options="ComplexityArray"
                @change="updateFilters"
                style="width: 90%"
              ></b-form-select>
            </b-col>
            <b-col>
              <div>
                <strong>Author</strong>
              </div>
              <b-form-select
                v-model="AuthorId"
                :options="authors"
                @change="updateFilters"
                style="width: 90%"
              ></b-form-select>
            </b-col>
            <b-col>
              <div>
                <strong>Assigned</strong>
              </div>
              <b-form-select
                v-model="AssignedToId"
                :options="assigned"
                @change="updateFilters"
                style="width: 90%"
              ></b-form-select>
            </b-col>
            <b-col class="py-2">
              <b-button @click="clearFilters" variant="outline-primary">
                <b-iconstack>
                  <b-icon icon="filter" scale="0.75" stacked/>
                  <b-icon icon="slash-circle" variant="danger" stacked />
                </b-iconstack>
                Clear Filters
              </b-button>
            </b-col>
          </b-row>
        </b-collapse>

      </b-card-text>
    </b-card>

    <div style="max-height: 500px; overflow-y: auto;">
      <IssueCard 
        v-for="(issue,index) of issues"
        :key="index"
        :issue="issue"
      />
    </div>

  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import IssueCard from '@/components/IssueCard'
import {
  ComplexityArray,
  IssueTypeArray,
  PriorityArray,
  StatusArray,
} from '../lib/options';
import { FullName } from '../lib/fullname'
import { userSort } from '../lib/user-sort'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    IssueCard,
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
      }
    ],
    ComplexityArray,
    IssueTypeArray,
    PriorityArray,
    StatusArray,
    Type: null,
    Status: null,
    Priority: null,
    Complexity: null,
    AuthorId: null,
    AssignedToId: null,
    Term: '',
    path: 'issue',
    filters: {},
    issues: [],
    authors: [],
    assigned: [],
    count: 0
  }),
  methods: {
    async getIssues() {
      this.$store.dispatch('loader/show')
      this.issues = []
      const results = await this.api.getData(this.path, this.filters, buildHeaders({}))
      this.issues = results
      this.count = results.length
      console.log(results[0])
      this.$store.dispatch('loader/hide')
    },
    async getUsers() {
      let results = await this.api.getData('user', {}, buildHeaders({}))
      results.sort(userSort)
      this.authors = [
        { value: null, text: ''}
      ]
      this.assigned = [
        { value: null, text: ''}
      ]
      for (let user of results) {
        this.authors.push({
          value: user.Id,
          text: FullName(user.Name)
        })
        this.assigned.push({
          value: user.Id,
          text: FullName(user.Name)
        })
      }
    },
    updateFilters() {
      this.filters = {}
      const { Status, Priority, Type, Complexity, AuthorId, AssignedToId } = this
      if (Status) {
        this.filters.Status = Status
      }
      if (Priority) {
        this.filters.Priority = Priority
      }
      if (Type) {
        this.filters.Type = Type
      }
      if (Complexity) {
        this.filters.Complexity = Complexity
      }
      if (AuthorId) {
        this.filters.AuthorId = AuthorId
      }
      if (AssignedToId) {
        this.filters.AssignedToId = AssignedToId
      }
      this.getIssues()
    },
    clearFilters() {
      this.filters = {}
      this.Type = null
      this.Status = null
      this.Complexity = null
      this.Priority = null
      this.AuthorId = null
      this.AssignedToId = null
      this.getIssues()
    }
  },
  mounted() {
    this.getIssues()
    this.getUsers()
  }
}
</script>