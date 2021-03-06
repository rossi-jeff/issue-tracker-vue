<template id="project-detail">
  <div class="project-detail">
    <Breadcrumb :trail="trail" />

    <b-card
      border-variant="dark"
      header-bg-variant="light"
      header="Edit Project"
      class="m-2"
    >
      <b-card-text>
        <FormProject :project="project" :enabled="session.signedIn" />
        <b-row class="m-4">
          <b-col>
            <b-button
              v-if="session.signedIn"
              variant="outline-success"
              @click="save"
            >
              Update
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to update a project
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>

    <ProjectIssues
      :issues="project.Issues"
      :session="session"
      @deleteClicked="deleteClicked"
      :key="issueKey"
    />
  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from "../lib/api-fetch";
import Breadcrumb from "@/components/Breadcrumb";
import FormProject from "@/components/FormProject";
import ProjectIssues from "@/components/ProjectIssues";
import { FlashHandler } from "../lib/flash-handler";

export default {
  components: {
    Breadcrumb,
    FormProject,
    ProjectIssues
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [
      {
        text: "Home",
        href: "/"
      },
      {
        text: "Projects",
        href: "/projects"
      }
    ],
    project: {
      Name: "",
      Details: "",
      Issues: []
    },
    uuid: null,
    issueKey: 0
  }),
  methods: {
    async getProject() {
      const results = await this.api.getData(
        `project/${this.uuid}`,
        {},
        buildHeaders(this.session)
      );
      this.project = results;
      if (this.trail.length == 2) {
        this.trail.push({
          text: results.Name,
          href: `/projects/${this.uuid}`
        });
      }
    },
    async save() {
      this.$store.dispatch("loader/show");
      try {
        const payload = JSON.parse(JSON.stringify(this.project));
        delete payload.Issues;
        await this.api.patchData(
          `project/${this.uuid}`,
          payload,
          buildHeaders(this.session)
        );
        this.flash.success(`Project ${this.project.Name} updated`);
        this.getProject();
      } catch (e) {
        this.flash.error(e.message);
      }
      this.$store.dispatch("loader/hide");
    },
    deleteClicked(UUID) {
      const issue = this.project.Issues.find(i => i.UUID === UUID);
      if (confirm(`Delete issue "${issue.Title}"`)) {
        this.deleteIssue(UUID);
      }
    },
    async deleteIssue(UUID) {
      try {
        await this.api.deleteData(
          `issue/${UUID}`,
          {},
          buildHeaders(this.session)
        );
        const idx = this.project.Issues.findIndex(i => i.UUID === UUID);
        if (idx !== -1) {
          this.project.Issues.splice(idx, 1);
          this.issueKey++;
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  created() {
    this.uuid = this.$route.params.uuid;
    this.getProject();
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
