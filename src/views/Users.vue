<template>
  <div class="users">
    <Breadcrumb :trail="trail" />

    <b-card
      header="Users"
      border-variant="dark"
      header-bg-variant="light"
      class="m-2"
    >
      <b-card-text>
        <b-button
          v-b-toggle.user-search
          size="sm"
          variant="outline-info"
          class="mx-2"
        >
          <b-icon icon="search" />
          Search
        </b-button>
        <b-button
          to="/users/new"
          size="sm"
          variant="outline-success"
          class="mx-2"
        >
          <b-icon icon="plus-circle"></b-icon>
          New User
        </b-button>
        <strong class="mx-2">Showing:</strong>
        {{ count }}

        <b-collapse id="user-search" class="mx-2 my-4">
          <b-input-group>
            <b-form-input
              v-model="Term"
              placeholder="Enter Search Term..."
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-info">
                Search
                <b-icon icon="search" />
              </b-button>
              <b-button variant="outline-secondary">
                Clear
                <b-iconstack>
                  <b-icon icon="filter" scale="0.75" stacked />
                  <b-icon icon="slash-circle" variant="danger" stacked />
                </b-iconstack>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-collapse>
      </b-card-text>
    </b-card>

    <div style="max-height: 500px; overflow-y: auto;">
      <UserCard v-for="(user, index) of users" :key="index" :user="user" />
    </div>
  </div>
</template>

<script>
import { buildHeaders, ApiFetch } from "../lib/api-fetch";
import UserCard from "@/components/UserCard";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  components: {
    UserCard,
    Breadcrumb
  },
  data: () => ({
    api: new ApiFetch(),
    trail: [
      {
        text: "Home",
        href: "/"
      },
      {
        text: "Users",
        href: "/users"
      }
    ],
    path: "user",
    Term: "",
    users: [],
    count: 0
  }),
  methods: {
    async getUsers() {
      this.$store.dispatch("loader/show");
      this.users = [];
      let results = await this.api.getData(
        this.path,
        {},
        buildHeaders(this.session)
      );
      this.users = results;
      this.count = results.length;
      console.log(results[0]);
      this.$store.dispatch("loader/hide");
    }
  },
  mounted() {
    this.getUsers();
  },
  computed: {
    session() {
      return this.$store.state.session;
    }
  }
};
</script>

<style>
.results {
  white-space: pre;
  max-height: 600px;
  overflow-y: auto;
}
</style>
