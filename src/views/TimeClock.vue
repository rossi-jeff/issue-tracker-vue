<template lang="html">
  <div class="time-clock">
    <Breadcrumb :trail="trail" />

    <b-card
      header="Time Card"
      border-variant="dark"
      header-bg-variant="light"
      class="m-2"
    >
      <b-card-text>
        <b-button
          v-b-toggle.issue-filters
          size="sm"
          variant="outline-primary"
          class="mx-2"
        >
          <b-icon icon="filter" />
          Filters
        </b-button>

        <b-button
          to="/time_clock/new"
          size="sm"
          variant="outline-success"
          class="mx-2"
        >
          <b-icon icon="plus-circle"></b-icon>
          New Time Clock
        </b-button>

        <b-collapse id="issue-filters" class="mx-2 my-4">
          <b-row cols="1" cols-sm="1" cols-md="2" cols-lg="3" cols-xl="5">
            <b-col class="p-2">
              <div>
                <strong>Users</strong>
              </div>
              <b-form-select
                v-model="filter.UserId"
                :options="options.users"
                class="p-1 my-1"
                style="width: 90%"
                @change="getTimeClocks"
              ></b-form-select>
            </b-col>
            <b-col class="p-2">
              <div>
                <strong>Projects</strong>
              </div>
              <b-form-select
                v-model="filter.ProjectId"
                :options="options.projects"
                class="p-1 my-1"
                style="width: 90%"
                @change="projectChanged"
              ></b-form-select>
            </b-col>
            <b-col class="p-2">
              <div>
                <strong>Issues</strong>
              </div>
              <b-form-select
                v-model="filter.IssueId"
                :options="options.issues"
                class="p-1 my-1"
                style="width: 90%"
                @change="issueChanged"
              ></b-form-select>
            </b-col>
            <b-col class="p-2">
              <div>
                <strong>From</strong>
              </div>
              <b-form-datepicker
                v-model="filter.StartDate"
                today-button
                style="width: 90%"
                @input="getTimeClocks"
              ></b-form-datepicker>
            </b-col>
            <b-col class="p-2">
              <div>
                <strong>To</strong>
              </div>
              <b-form-datepicker
                v-model="filter.EndDate"
                today-button
                style="width: 90%"
                @input="getTimeClocks"
              ></b-form-datepicker>
            </b-col>
          </b-row>
        </b-collapse>
      </b-card-text>
    </b-card>
    <TableTimeClock :items="items" :fields="fields" :key="tableKey" />
  </div>
</template>

<script>
import {
  buildHeaders,
  ApiFetch
} from "../lib/api-fetch";
import Breadcrumb from "@/components/Breadcrumb";
import {
  FullName
} from "../lib/fullname";
import {
  RemoveBlanks
} from "../lib/RemoveBlanks";
import {
  formatDate
} from "../lib/format-date";
import TableTimeClock from "@/components/TableTimeClock";

export default {
  components: {
    Breadcrumb,
    TableTimeClock
  },
  data: () => ({
    api: new ApiFetch(),
    trail: [{
        text: "Home",
        href: "/"
      },
      {
        text: "Time Clock",
        href: "/time_clock"
      }
    ],
    filter: {
      UserId: null,
      IssueId: null,
      ProjectId: null,
      StartDate: null,
      EndDate: null
    },
    timeclocks: [],
    projects: [],
    issues: [],
    users: [],
    options: {
      projects: [],
      issues: [],
      users: []
    },
    count: {
      projects: 0,
      issues: 0,
      users: 0,
      timeclocks: 0
    },
    items: [],
    fields: [{
        key: "uuid",
        label: "Edit"
      },
      {
        key: "name",
        class: "ellipsis"
      },
      {
        key: "project",
        class: "ellipsis"
      },
      {
        key: "issue",
        class: "ellipsis"
      },
      {
        key: "start_date",
        class: "nowrap"
      },
      {
        key: "start_time",
        class: "nowrap"
      },
      {
        key: "end_date",
        class: "nowrap"
      },
      {
        key: "end_time",
        class: "nowrap"
      },
      {
        key: "hours",
        class: "nowrap"
      }
    ],
    tableKey: 0
  }),
  methods: {
    async getTimeClocks() {
      const results = await this.api.getData(
        "timeclock",
        RemoveBlanks(this.filter),
        buildHeaders(this.session)
      );
      this.timeclocks = results;
      console.log("getTimeClocks", results.length);
      this.buildTableItems();
    },
    async getProjects() {
      const results = await this.api.getData(
        "project", {},
        buildHeaders(this.session)
      );
      this.projects = results;
      this.options.projects = [{
        value: null,
        text: ""
      }];
      for (let project of results) {
        this.options.projects.push({
          value: project.Id,
          text: project.Name
        });
      }
      this.count.projects = results.length;
    },
    async getIssues() {
      const results = await this.api.getData(
        "issue",
        this.filters,
        buildHeaders(this.session)
      );
      this.issues = results;
      this.options.issues = [{
        value: null,
        text: ""
      }];
      for (let issue of results) {
        this.options.issues.push({
          value: issue.Id,
          text: issue.Title
        });
      }
      this.count.issues = results.length;
    },
    async getUsers() {
      let results = await this.api.getData(
        "user", {},
        buildHeaders(this.session)
      );
      this.users = results;
      this.options.users = [{
        value: null,
        text: ""
      }];
      for (let user of results) {
        this.options.users.push({
          value: user.Id,
          text: FullName(user.Name)
        });
      }
      this.count.users = results.length;
    },
    projectChanged() {
      this.options.issues = [{
        value: null,
        text: ""
      }];
      for (let issue of this.issues) {
        if (
          this.filter.ProjectId != null &&
          this.filter.ProjectId != issue.ProjectId
        )
          continue;
        this.options.issues.push({
          value: issue.Id,
          text: issue.Title
        });
      }
      let available = this.options.issues.map(opt => opt.value);
      if (!available.includes(this.filter.IssueId)) this.filter.IssueId = null;
      this.getTimeClocks();
    },
    issueChanged() {
      const {
        IssueId
      } = this.filter;
      let issue = this.issues.find(i => i.Id == IssueId);
      if (issue) this.filter.ProjectId = issue.ProjectId;
      this.getTimeClocks();
    },
    buildTableItems() {
      this.items = [];
      for (let clock of this.timeclocks) {
        let hours = "",
          sDate,
          eDate,
          ms;
        let name = clock.User ? FullName(clock.User.Name) : "";
        let project = clock.Project ? clock.Project.Name : "";
        let issue = clock.Issue ? clock.Issue.Title : "";
        if (clock.Start.Date && clock.Start.Time) {
          sDate = new Date(`${clock.Start.Date} ${clock.Start.Time}`);
        }
        if (clock.End.Date && clock.End.Time) {
          eDate = new Date(`${clock.End.Date} ${clock.End.Time}`);
        }
        if (sDate && eDate) {
          ms = eDate.getTime() - sDate.getTime();
          hours = Math.round(ms / 36000) / 100;
        }
        this.items.push({
          uuid: clock.UUID,
          name,
          project,
          issue,
          start_date: clock.Start.Date,
          start_time: clock.Start.Time,
          end_date: clock.End.Date,
          end_time: clock.End.Time,
          hours
        });
      }
      // this.tableKey += 1;
    }
  },
  created() {
    const week = 7 * 24 * 60 * 60 * 1000;
    const EndDate = new Date();
    const StartDate = new Date(EndDate.getTime() - 2 * week);
    this.filter.StartDate = formatDate(StartDate);
    this.filter.EndDate = formatDate(EndDate);
    this.getProjects();
    this.getIssues();
    this.getUsers();
    this.getTimeClocks();
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  }
};
</script>
