<template>
  <div class="projects">
    <Breadcrumb :trail="trail" />

    <b-card
      header="Projects"
      border-variant="dark"
      header-bg-variant="light"
      class="m-2"
    >
      <b-button
        to="/projects/new"
        size="sm"
        variant="outline-success"
        class="mx-2"
      >
        <b-icon icon="plus-circle"></b-icon>
        New Project
      </b-button>

      <strong class="mx-2">Showing:</strong>
      {{ count }}
    </b-card>

    <div style="max-height: 500px; overflow-y: auto;">
      <ProjectCard
        v-for="project of projects"
        :key="project.Id"
        :project="project"
        :session="session"
        @deleteClicked="deleteClicked"
      />
    </div>

    <ResetAlert
      :signedIn="session.signedIn"
      :session="session"
      entity="project"
      :key="resetKey"
      @reset="resetDeleted"
    />
  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from "../lib/api-fetch";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectCard from "@/components/ProjectCard";
import ResetAlert from "@/components/ResetAlert";

export default {
  components: {
    Breadcrumb,
    ProjectCard,
    ResetAlert
  },
  data: () => ({
    api: new ApiFetch(),
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
    projects: [],
    count: 0,
    resetKey: 0
  }),
  methods: {
    async getProjects() {
      this.$store.dispatch("loader/show");
      const results = await this.api.getData(
        "project",
        {},
        buildHeaders(this.session)
      );
      console.log(results);
      this.projects = results;
      this.count = results.length;
      this.$store.dispatch("loader/hide");
    },
    async resetDeleted() {
      console.log("resetDeleted");
      try {
        const results = await this.api.postData(
          "project/reset",
          {},
          buildHeaders(this.session)
        );
        this.projects = results;
        this.count = results.length;
        this.resetKey++;
      } catch (e) {
        console.log(e);
      }
    },
    deleteClicked(UUID) {
      const project = this.projects.find(p => p.UUID === UUID);
      if (confirm(`Delete project "${project.Name}"?`)) {
        this.deleteProject(UUID);
      }
    },
    async deleteProject(UUID) {
      try {
        await this.api.deleteData(
          `project/${UUID}`,
          {},
          buildHeaders(this.session)
        );
        const idx = this.projects.findIndex(p => p.UUID === UUID);
        if (idx !== -1) {
          this.projects.splice(idx, 1);
          this.resetKey++;
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  created() {
    this.getProjects();
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  }
};
</script>
