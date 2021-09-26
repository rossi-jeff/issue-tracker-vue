<template id="project-new">
  <div class="project-new">
    
    <Breadcrumb :trail="trail" />

    <b-card border-variant="dark" header-bg-variant="light" header="New Project" class="m-2">
      <b-card-text>
        <FormProject :project="project" :enabled="session.signedIn" />
        <b-row class="m-4">
          <b-col>
            <b-button v-if="session.signedIn" variant="outline-success" @click="save">
              Save
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-alert show v-if="!session.signedIn" variant="warning">
              You must be signed in to create a project
            </b-alert>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>

  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import FormProject from '@/components/FormProject'
import {
  buildHeaders,
  ApiFetch
} from '../lib/api-fetch'
import { FlashHandler } from '../lib/flash-handler'


export default {
  components: {
    Breadcrumb,
    FormProject
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
      },
      {
        text: 'New Project',
        href: '/projects/new'
      }
    ],
    project: {
      Name: '',
      Details: '',
      Issues: []
    },
  }),
  methods: {
    async save() {
      this.$store.dispatch('loader/show')
      try {
        const payload = JSON.parse(JSON.stringify(this.project))
        delete payload.Issues
        const results = await this.api.postData('project', payload, buildHeaders(this.session));
        this.flash.success(`Project added: ${results.Name}`)
        setTimeout(() => {
          this.$router.push(`/projects/${results.UUID}`);
        }, 500)
      } catch(e) {
        this.flash.error(e.message)
      }
      this.$store.dispatch('loader/hide')
    }
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
