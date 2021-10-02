<template lang="html">
  <div class="time-clock-new">
    <Breadcrumb :trail="trail" />

    <b-card
      border-variant="dark"
      header-bg-variant="light"
      header="New Time Card"
      class="m-2"
    >
      <b-card-text>
        <FormTimeClock
          :options="options"
          :timeclock="timeclock"
          :session="session"
          @projectChanged="projectChanged"
          @issueChanged="issueChanged"
        />
        <b-row class="m-4">
          <b-col>
            <b-button
              v-if="session.signedIn"
              variant="outline-success"
              @click="saveTimeCard"
              :disabled="!session.signedIn"
            >
              Save
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to create a time clock
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import {
  buildHeaders,
  ApiFetch
} from "../lib/api-fetch";
import Breadcrumb from "@/components/Breadcrumb";
import {
  FlashHandler
} from "../lib/flash-handler";
import FormTimeClock from "@/components/FormTimeClock";
import {
  FullName
} from "../lib/fullname";
import {
  userSort
} from "../lib/user-sort";

export default {
  components: {
    Breadcrumb,
    FormTimeClock
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [{
        text: "Home",
        href: "/"
      },
      {
        text: "Time Clock",
        href: "/time_clock"
      },
      {
        text: "New Time Clock",
        href: "/time_clock/new"
      }
    ],
    timeclock: {
      Start: {
        Date: "",
        Time: ""
      },
      End: {
        Date: "",
        Time: ""
      },
      ProjectId: null,
      IssueId: null
    },
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
      users: 0
    }
  }),
  methods: {
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
      this.users.sort(userSort);
      this.options.users = [{
        value: null,
        text: ""
      }];
      for (let user of this.users) {
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
          this.timeclock.ProjectId != null &&
          this.timeclock.ProjectId != issue.ProjectId
        )
          continue;
        this.options.issues.push({
          value: issue.Id,
          text: issue.Title
        });
      }
      let available = this.options.issues.map(opt => opt.value);
      if (!available.includes(this.timeclock.IssueId))
        this.timeclock.IssueId = null;
    },
    issueChanged() {
      const {
        IssueId
      } = this.timeclock;
      let issue = this.issues.find(i => i.Id == IssueId);
      if (issue) this.timeclock.ProjectId = issue.ProjectId;
    },
    async saveTimeCard() {
      this.$store.dispatch("loader/show");
      try {
        await this.api.postData(
          "timeclock",
          this.timeclock,
          buildHeaders(this.session)
        );
        this.flash.success("Time clock saved");
      } catch (e) {
        this.flash.error(`Error: ${e.message} saving time card`);
      }
      this.$store.dispatch("loader/hide");
    }
  },
  created() {
    this.getProjects();
    this.getIssues();
    this.getUsers();
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  },
  mounted() {
    this.flash.setStore(this.$store);
  }
};
</script>

<style lang="css" scoped></style>
