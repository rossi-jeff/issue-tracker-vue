<template>
  <div>
      <b-row class="m-4">
        <b-col>
          <div>
            <strong>Project</strong>
          </div>
          <b-form-select
            v-model="issue.ProjectId" 
            :options="projects"
            :disabled="!enabled"
            style="width: 100%"
            class="p-1 my-1"
          ></b-form-select>
        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text>
                Title
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input v-validate="'required|min:6'" name="Title" v-model="issue.Title" :disabled="!enabled"></b-form-input>
          </b-input-group>
          <div class="vee-validate-error p-1">{{ errors.first('Title') }}</div>
        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>
          <b-form-group label="Details" label-for="Details">
            <b-form-textarea v-validate="'required|min:6'" name="Details" id="Details" v-model="issue.Details" :disabled="!enabled"></b-form-textarea>
          </b-form-group>
          <div class="vee-validate-error p-1">{{ errors.first('Details') }}</div> 
        </b-col>
      </b-row>
      <b-row class="m-4" cols="1" cols-sm="2" cols-md="3" cols-lg="5" cols-xl="5">
        <b-col>
          <div>
            <strong>Priority</strong>
          </div>
          <b-form-select
            v-model="issue.Priority" 
            :options="PriorityArray"
            :disabled="!enabled"
            style="width: 90%"
            class="p-1 my-1"
          ></b-form-select>
        </b-col>
        <b-col>
          <div>
            <strong>Status</strong>
          </div>
          <b-form-select 
            v-model="issue.Status" 
            :options="StatusArray"
            :disabled="!enabled"
            style="width: 90%"
            class="p-1 my-1"
          ></b-form-select>
        </b-col>
        <b-col>
          <div>
            <strong>Type</strong>
          </div>
          <b-form-select 
            v-model="issue.Type" 
            :options="IssueTypeArray"
            :disabled="!enabled"
            style="width: 90%"
            class="p-1 my-1"
          ></b-form-select>
        </b-col>
        <b-col>
          <div>
            <strong>Complexity</strong>
          </div>
          <b-form-select 
            v-model="issue.Complexity" 
            :options="ComplexityArray"
            :disabled="!enabled"
            style="width: 90%"
            class="p-1 my-1"
          ></b-form-select>
        </b-col>
        <b-col>
          <div>
            <strong>Assigned</strong>
          </div>
          <b-form-select
            v-model="issue.AssignedToId"
            :options="assigned"
            :disabled="!enabled"
            style="width: 90%"
            class="p-1 my-1"
          ></b-form-select>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from '../lib/api-fetch'
import {
  ComplexityArray,
  IssueTypeArray,
  PriorityArray,
  StatusArray,
} from '../lib/options';
import { userSort } from '../lib/user-sort'
import { FullName } from '../lib/fullname'
import { projectSort } from '../lib/project-sort'

export default {
  props: ['issue','enabled'],
  data: () => ({
    api: new ApiFetch(),
    ComplexityArray,
    IssueTypeArray,
    PriorityArray,
    StatusArray,
    assigned: [],
    projects: [],
  }),
  methods: {
    async getUsers() {
      let results = await this.api.getData('user', {}, buildHeaders({}))
      results.sort(userSort)
      this.assigned = [
        { value: null, text: ''}
      ]
      for (let user of results) {
        this.assigned.push({
          value: user.Id,
          text: FullName(user.Name)
        })
      }
    },
    async getProjects() {
      let results = await this.api.getData('project', {}, buildHeaders({}))
      results.sort(projectSort)
      this.projects = [
        { value: null, text: ''}
      ]
      for (let project of results) {
        this.projects.push({
          value: project.Id,
          text: project.Name
        })
      }
    }
  },
  created() {
    this.getUsers()
    this.getProjects()
  }
}
</script>

<style>
label {
  font-weight: bold;
}
</style>