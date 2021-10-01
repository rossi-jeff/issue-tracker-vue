<template>
<div class="projects">
  <Breadcrumb :trail="trail" />

  <b-card header="Projects" border-variant="dark" header-bg-variant="light" class="m-2">
    <b-button to="/projects/new" size="sm" variant="outline-success" class="mx-2">
      <b-icon icon="plus-circle"></b-icon>
      New Project
    </b-button>

    <strong class="mx-2">Showing:</strong>
    {{ count }}
  </b-card>

  <div style="max-height: 500px; overflow-y: auto;">
    <ProjectCard v-for="project of projects" :key="project.Id" :project="project" />
  </div>
</div>
</template>

<script>
import {
  buildHeaders,
  ApiFetch
} from "../lib/api-fetch";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectCard from "@/components/ProjectCard";

export default {
  components: {
    Breadcrumb,
    ProjectCard
  },
  data: () => ({
    api: new ApiFetch(),
    trail: [{
        text: "Home",
        href: "/"
      },
      {
        text: "Projects",
        href: "/projects"
      }
    ],
    projects: [],
    count: 0
  }),
  methods: {
    async getProjects() {
      this.$store.dispatch("loader/show");
      const results = await this.api.getData("project", {}, buildHeaders(this.session));
      console.log(results);
      this.projects = results;
      this.count = results.length;
      this.$store.dispatch("loader/hide");
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
