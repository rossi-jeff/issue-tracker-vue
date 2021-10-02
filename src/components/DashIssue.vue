<template lang="html">
  <b-card
    no-body
    border-variant="dark"
    header-bg-variant="light"
    class="m-2 dash-issue"
    header-tag="header"
  >
    <template #header>
      <b-button size="sm" style="float:right;" @click="edit" title="Edit issue">
        <b-icon icon="pencil-square"></b-icon>
      </b-button>
      <h5 @click="issueVisble = !issueVisble" title="Click to expand issue">
        {{ issue.SequenceNumber }}
      </h5>
      <div style="clear:right;"></div>
    </template>

    <b-collapse v-model="issueVisble" id="dash-issue-collapse">
      <div class="accordion mx-1 mb-4 p-2" role="tablist">
        <div class="p-2">{{ issue.Title }}</div>

        <b-card no-body>
          <b-card-header header-tag="header" class="p-2" role="tab">
            <b-button
              style="width: 100%"
              variant="secondary"
              @click="descriptionPanel = !descriptionPanel"
              >Description</b-button
            >
            <b-collapse
              class="description-panel p-2"
              :accordion="accordion"
              role="tabpanel"
              v-model="descriptionPanel"
            >
              {{ issue.Details }}
            </b-collapse>
          </b-card-header>
        </b-card>

        <b-card no-body>
          <b-card-header header-tag="header" class="p-2" role="tab">
            <b-button
              style="width: 100%"
              variant="secondary"
              @click="detailsPanel = !detailsPanel"
              >Details</b-button
            >
            <b-collapse
              class="details-panel p-2"
              :accordion="accordion"
              role="tabpanel"
              v-model="detailsPanel"
            >
              <b-row cols="1">
                <b-col>
                  <strong class="mr-6">Project</strong>
                  {{ project }}
                </b-col>
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
              </b-row>
              <b-row cols="1">
                <b-col>
                  <strong class="mr-6">Complexity</strong>
                  {{ issue.Complexity }}
                </b-col>
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
            </b-collapse>
          </b-card-header>
        </b-card>
      </div>
    </b-collapse>
  </b-card>
</template>

<script>
import { FullName } from "@/lib/fullname";

export default {
  props: ["issue", "session"],
  data: () => ({
    titlePanel: true,
    descriptionPanel: false,
    detailsPanel: false,
    accordion: "dash-issue-accordion",
    author: "",
    assigned: "",
    project: "",
    issueVisble: false
  }),
  methods: {
    edit() {
      this.$emit("edit", this.issue.UUID);
    }
  },
  mounted() {
    this.accordion += `-${this.issue.Id}`;
    if (this.issue.Author && this.issue.Author.Name) {
      this.author = FullName(this.issue.Author.Name);
    }
    if (this.issue.AssignedTo && this.issue.AssignedTo.Name) {
      this.assigned = FullName(this.issue.AssignedTo.Name);
    }
    if (this.issue.Project) {
      this.project = this.issue.Project.Name;
    }
    this.$emit("loaded", this.issue.UUID);
  }
};
</script>

<style lang="css" scoped>
h5 {
  display: inline-block;
  width: 75%;
  cursor: pointer;
}
</style>
