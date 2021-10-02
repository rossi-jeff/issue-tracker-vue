<template>
<div class="home">
  <Breadcrumb :trail="trail" />

  <h4 class="m-2">Welcome to Issue Tracker</h4>

  <div class="m-2">
    This site is a functional example of an issue tracking application. All of
    the existing data has been generated randomly. It is not intended to be
    used as a replacement for current leaders in the field such as Jira. The
    goal of the site is simply a proof of concept for an issue tracking
    application.
  </div>

  <div class="m-2 mb-4">
    Construction of the site used the component based framework Vue. The
    benefit of using a component based framework is that it becomes easier to
    follow the DRY ( don't repeat yourself ) principle. In addition, effort
    was made not to reinvent the wheel. In so doing, the open source packages
    listed below were utilized.
  </div>

  <b-card class="m-2" header="Resources used in this site" border-variant="dark" header-bg-variant="light">
    <b-tabs small card v-model="tabIndex">
      <b-tab v-for="resource in resources" :key="resource.Id" :title="resource.Name" :resource="resource">
        <div class="p-2">
          {{ resource.Details }}
        </div>
        <b-button :href="resource.Url" target="_blank" variant="outline-primary" class="mx-2">
          <b-icon icon="bookmark" class="mr-1"></b-icon>
          Visit {{ resource.Name }}
        </b-button>
      </b-tab>
    </b-tabs>
  </b-card>
</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import {
  FlashHandler
} from "../lib/flash-handler";
import {
  buildHeaders,
  ApiFetch
} from "../lib/api-fetch";

export default {
  name: "Home",
  components: {
    Breadcrumb
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [{
      text: "Home",
      href: "/"
    }],
    resources: [],
    tabIndex: 0
  }),
  methods: {
    async getResources() {
      this.resources = await this.api.getData("resource", {}, buildHeaders({}));
      this.flash.success("Resources loaded");
    }
  },
  mounted() {
    this.flash.setStore(this.$store);
    this.getResources();
  }
};
</script>
