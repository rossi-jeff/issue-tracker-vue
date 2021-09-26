<template id="project-detail">
  <div class="project-detail">
    
    <Breadcrumb :trail="trail" />

    <b-card border-variant="dark" header-bg-variant="light" header="Edit Project" class="m-2">
      <b-card-text>
        <FormProject :project="project" :enabled="session.signedIn" />
        <b-row class="m-4">
          <b-col>
            <b-button v-if="session.signedIn" variant="outline-success" @click="save">
              Update
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to create a project
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>

    <ProjectIssues :issues="project.Issues" />

  </div>
</template>

<script>
import {
  buildHeaders,
  ApiFetch
} from '../lib/api-fetch'
import Breadcrumb from '@/components/Breadcrumb'
import FormProject from '@/components/FormProject'
import ProjectIssues from '@/components/ProjectIssues'
import { FlashHandler } from '../lib/flash-handler'

export default {
  components: {
    Breadcrumb,
    FormProject,
    ProjectIssues
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [{
        text: 'Home',
        href: '/'
      },
      {
        text: 'Projects',
        href: '/projects'
      }
    ],
    project: {
      Name: '',
      Details: '',
      Issues: []
    },
    uuid: null,
  }),
  methods: {
    async getProject() {
      const results = await this.api.getData(`project/${this.uuid}`, {}, buildHeaders(this.session))
      this.project = results
      if (this.trail.length == 2) {
        this.trail.push({
          text: results.Name,
          href: `/projects/${this.uuid}`
        })
      }
    },
    async save() {
      this.$store.dispatch('loader/show')
      try {
        const payload = JSON.parse(JSON.stringify(this.project))
        delete payload.Issues
        await this.api.patchData(`project/${this.uuid}`, payload, buildHeaders(this.session))
        this.flash.success(`Project ${this.project.Name} updated`)
        this.getProject()
      } catch(e) {
        this.flash.error(e.message)
      }
      this.$store.dispatch('loader/hide')
    }
  },
  created() {
    this.uuid = this.$route.params.uuid;
    this.getProject()
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  },
  mounted() {
    this.flash.setStore(this.$store)
  }
}
</script>
