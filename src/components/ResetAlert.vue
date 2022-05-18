<template lang="html">
  <div class="reset-alert" v-if="signedIn && count">
    <b-card border-variant="dark" class="m-2">
      <b-card-text>
        {{ message }}
      </b-card-text>

      <b-button @click="resetClicked">Reset</b-button>
    </b-card>
  </div>
</template>

<script>
import {
  buildHeaders,
  ApiFetch
} from "../lib/api-fetch";

export default {
  props: ["signedIn", "entity", "session"],
  data: () => ({
    api: new ApiFetch(),
    count: 0,
    message: ""
  }),
  methods: {
    async getCount() {
      const {
        entity,
        session
      } = this;
      try {
        const results = await this.api.getData(
          `${entity}/deleted`, {},
          buildHeaders(session)
        );
        this.count = results.count;
        let label = results.count === 1 ? entity : `${entity}s`;
        let verb = results.count === 1 ? "has" : "have";
        this.message = `${results.count} ${label} ${verb} been soft deleted, click the button below to reset them`;
      } catch (e) {
        console.log(e);
      }
    },
    resetClicked() {
      this.$emit('reset')
    }
  },
  created() {
    this.getCount();
  }
};
</script>

<style lang="css" scoped></style>
