<template lang="html">
  <div class="dashboard">
    <Breadcrumb :trail="trail" />
    <b-card
      header="Dashboard"
      border-variant="dark"
      header-bg-variant="light"
      class="m-2"
    >
      <b-card-text>
        <b-row>
          <b-col id="col-new">
            <DashColumn
              :issues="columns.New"
              :draggable="true"
              :droppable="true"
              status="New"
              @dropped="handleDrop"
              :session="session"
              :key="key.new"
              @edit="editIssue"
            />
          </b-col>
          <b-col id="col-assigned">
            <DashColumn
              :issues="columns.Assigned"
              :draggable="true"
              :droppable="true"
              status="Assigned"
              @dropped="handleDrop"
              :session="session"
              :key="key.assigned"
              @edit="editIssue"
            />
          </b-col>
          <b-col id="col-accepted">
            <DashColumn
              :issues="columns.Accepted"
              :draggable="true"
              :droppable="true"
              status="Accepted"
              @dropped="handleDrop"
              :session="session"
              :key="key.accepted"
              @edit="editIssue"
            />
          </b-col>
          <b-col id="col-fixed">
            <DashColumn
              :issues="columns.Fixed"
              :draggable="true"
              :droppable="true"
              status="Fixed"
              @dropped="handleDrop"
              :session="session"
              :key="key.fixed"
              @edit="editIssue"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col id="col-other">
            <DashColumn
              :issues="columns.New"
              :draggable="true"
              :droppable="false"
              status="Other"
              :session="session"
              :key="key.other"
              @edit="editIssue"
            />
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
    <b-modal
      scrollable
      id="edit-issue-modal"
      :title="editor.title"
      @ok="handleOk"
      ok-title="Update"
    >
      <FormModalIssue :issue="editor.issue" :enabled="session.signedIn" />
    </b-modal>
  </div>
</template>

<script>
import DashColumn from "@/components/DashColumn";
import Breadcrumb from "@/components/Breadcrumb";
import {
  buildHeaders,
  ApiFetch
} from "../lib/api-fetch";
import FormModalIssue from "../components/FormModalIssue";
import {
  FlashHandler
} from "../lib/flash-handler";

export default {
  components: {
    Breadcrumb,
    DashColumn,
    FormModalIssue
  },
  data: () => ({
    flash: new FlashHandler(),
    api: new ApiFetch(),
    trail: [{
        text: "Home",
        href: "/"
      },
      {
        text: "Dashboard",
        href: "/dashboard"
      }
    ],
    issues: [],
    count: 0,
    columns: {
      New: [],
      Assigned: [],
      Accepted: [],
      Fixed: [],
      Other: []
    },
    key: {
      new: 0,
      assigned: 0,
      accepted: 0,
      fixed: 0,
      other: 0
    },
    editor: {
      title: "Edit Issue",
      issue: {}
    }
  }),
  methods: {
    async getIssues() {
      this.$store.dispatch("loader/show");
      this.issues = [];
      const results = await this.api.getData(
        "issue", {},
        buildHeaders(this.session)
      );
      this.issues = results;
      this.count = results.length;
      this.sortIssues();
      this.$store.dispatch("loader/hide");
    },
    sortIssues() {
      this.columns.New = [];
      this.columns.Assigned = [];
      this.columns.Accepted = [];
      this.columns.Fixed = [];
      this.columns.Other = [];
      for (let issue of this.issues) {
        switch (issue.Status) {
          case "New":
            this.columns.New.push(issue);
            break;
          case "Assigned":
            this.columns.Assigned.push(issue);
            break;
          case "Accepted":
            this.columns.Accepted.push(issue);
            break;
          case "Fixed":
            this.columns.Fixed.push(issue);
            break;
          default:
            this.columns.Other.push(issue);
            break;
        }
      }
    },
    handleDrop(event) {
      const {
        uuid,
        status
      } = event;
      let idx, issue, from;
      idx = this.columns.New.findIndex(i => i.UUID == uuid);
      if (idx != -1) {
        from = "New";
        issue = this.columns.New.splice(idx, 1);
      }
      if (!issue) {
        idx = this.columns.Assigned.findIndex(i => i.UUID == uuid);
        if (idx != -1) {
          from = "Assigned";
          issue = this.columns.Assigned.splice(idx, 1);
        }
      }
      if (!issue) {
        idx = this.columns.Accepted.findIndex(i => i.UUID == uuid);
        if (idx != -1) {
          from = "Accepted";
          issue = this.columns.Accepted.splice(idx, 1);
        }
      }
      if (!issue) {
        idx = this.columns.Fixed.findIndex(i => i.UUID == uuid);
        if (idx != -1) {
          from = "Fixed";
          issue = this.columns.Fixed.splice(idx, 1);
        }
      }
      if (!issue) {
        idx = this.columns.Other.findIndex(i => i.UUID == uuid);
        if (idx != -1) {
          from = "Other";
          issue = this.columns.Other.splice(idx, 1);
        }
      }
      if (issue) {
        issue = this.issues.find(i => i.UUID == uuid);
        issue.Status = status;
        this.updateIssue(issue);
        switch (status) {
          case "New":
            this.columns.New.unshift(issue);
            this.key.new += 1;
            break;
          case "Assigned":
            this.columns.Assigned.unshift(issue);
            this.key.assigned += 1;
            break;
          case "Accepted":
            this.columns.Accepted.unshift(issue);
            this.key.accepted += 1;
            break;
          case "Fixed":
            this.columns.Fixed.unshift(issue);
            this.key.fixed += 1;
            break;
          default:
            break;
        }
        this.key[from] += 1;
        this.flash.success(`Issue: ${issue.SequenceNumber} updated`);
      }
    },
    async updateIssue(issue) {
      return await this.api.patchData(
        `issue/${issue.uuid}`,
        issue,
        buildHeaders(this.session)
      );
    },
    editIssue(ev) {
      this.editor.issue = this.issues.find(i => i.UUID == ev);
      this.editor.title = `Edit Issue - ${this.editor.issue.SequenceNumber}`;
      this.$bvModal.show("edit-issue-modal");
    },
    async handleOk(ev) {
      ev.preventDefault();
      const {
        issue
      } = this.editor;
      const updated = await this.updateIssue(issue);

      const idx = this.issues.findIndex(i => i.UUID == updated.UUID);
      if (idx != -1) {
        this.issues[idx] = updated;
        this.sortIssues();
        this.getIssues();
      }
      this.flash.success(`Issue: ${updated.SequenceNumber} updated`);
      this.$bvModal.hide("edit-issue-modal");
    }
  },
  mounted() {
    this.getIssues();
    this.flash.setStore(this.$store);
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  }
};
</script>

<style lang="css">
.dash-column .dash-column-body {
  height: 400px;
  overflow-y: auto;
}
</style>
