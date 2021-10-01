<template lang="html">
  <div class="user-profile">
    <Breadcrumb :trail="trail" />

    <b-card
      border-variant="dark"
      header-bg-variant="light"
      header="User Profile"
      class="m-2"
    >
      <b-card-text>
        <b-row class="my-4">
          <b-col>
            <b-button
              variant="outline-warning"
              v-b-modal.change-password-modal
              :disabled="uuid != session.UUID"
            >
              Change Password
              <b-icon icon="lock"></b-icon>
            </b-button>
          </b-col>
        </b-row>
        <FormUser
          :key="formKey"
          :user="user"
          :showPass="false"
          :enabled="enabled"
          @editEmail="editEmail"
          @deleteEmail="deleteEmail"
          @editPhone="editPhone"
          @deletePhone="deletePhone"
          @addEmail="addEmail"
          @addPhone="addPhone"
          @rolesChanged="rolesChanged"
        />
        <b-form-checkbox
          id="enabled-cb"
          v-model="enabled"
          name="enabled-cb"
          :value="true"
          :unchecked-value="false"
          :disabled="!session.signedIn"
          class="my-2"
        >
          Enable Edit Form
        </b-form-checkbox>
      </b-card-text>
    </b-card>

    <TableTimeClock :items="items" :fields="fields" />

    <b-modal
      id="change-password-modal"
      title="Change Password"
      header-bg-variant="primary"
      @ok="handleOk"
      ok-title="Change Password"
    >
      <div class="mx-2 my-4">
        <b-input-group prepend="Old">
          <b-form-input
            id="OldPassWord"
            name="OldPassWord"
            v-validate="'required|min:6'"
            v-model="change_password.OldPassword"
            type="password"
            required
          ></b-form-input>
          <b-input-group-append>
            <b-input-group-text>
              <b-icon icon="lock"></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <div class="vee-validate-error p-1">
          {{ errors.first("OldPassWord") }}
        </div>
      </div>
      <div class="mx-2 my-4">
        <b-input-group prepend="New">
          <b-form-input
            id="NewPassWord"
            name="NewPassWord"
            v-validate="'required|min:6'"
            v-model="change_password.Password"
            type="password"
            required
            ref="NewPassWord"
          ></b-form-input>
          <b-input-group-append>
            <b-input-group-text>
              <b-icon icon="lock"></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <div class="vee-validate-error p-1">
          {{ errors.first("NewPassWord") }}
        </div>
      </div>
      <div class="mx-2 my-4">
        <b-input-group prepend="Confirm">
          <b-form-input
            id="Confirm"
            name="Confirm"
            v-validate="'required|confirmed:NewPassWord'"
            v-model="change_password.Confirm"
            type="password"
            required
            data-vv-as="NewPassWord"
          ></b-form-input>
          <b-input-group-append>
            <b-input-group-text>
              <b-icon icon="lock"></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <div class="vee-validate-error p-1">
          {{ errors.first("Confirm") }}
        </div>
      </div>
    </b-modal>
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
import {
  FullName
} from "../lib/fullname";
import FormUser from "@/components/FormUser";
import TableTimeClock from "@/components/TableTimeClock";

export default {
  components: {
    Breadcrumb,
    FormUser,
    TableTimeClock
  },
  data: () => ({
    api: new ApiFetch(),
    flash: new FlashHandler(),
    trail: [{
      text: "Home",
      href: "/"
    }],
    user: {
      Name: {
        First: "",
        Middle: "",
        Last: ""
      },
      Credentials: {
        Username: "",
        Password: ""
      },
      Phones: [],
      Emails: [],
      Roles: []
    },
    formKey: 0,
    enabled: false,
    change_password: {
      OldPassword: "",
      Password: "",
      Confirm: ""
    },
    timeclocks: [],
    items: [],
    fields: [{
        key: "uuid",
        label: "Edit"
      },
      {
        key: "name",
        class: "ellipsis"
      },
      {
        key: "project",
        class: "ellipsis"
      },
      {
        key: "issue",
        class: "ellipsis"
      },
      {
        key: "start_date",
        class: "nowrap"
      },
      {
        key: "start_time",
        class: "nowrap"
      },
      {
        key: "end_date",
        class: "nowrap"
      },
      {
        key: "end_time",
        class: "nowrap"
      },
      {
        key: "hours",
        class: "nowrap"
      }
    ]
  }),
  methods: {
    async getUser() {
      this.$store.dispatch("loader/show");
      const results = await this.api.getData(
        `user/${this.uuid}`, {},
        buildHeaders(this.session)
      );
      this.user = results;
      this.formKey += 1;
      if (this.trail.length == 1) {
        this.trail.push({
          text: "Profile: " + FullName(results.Name),
          href: `/profile/${this.uuid}`
        });
      }
      this.$store.dispatch("loader/hide");
    },
    async changePassword() {
      this.$store.dispatch("loader/show");
      try {
        await this.api.postData(
          `user/${this.uuid}/password`,
          this.change_password,
          buildHeaders(this.session)
        );
        console.log("success");
        this.flash.success("PassWord Changed");
        this.$nextTick(() => {
          this.$bvModal.hide("change-password-modal");
        });
      } catch (e) {
        this.flash.error("Unauthorized Error");
      }
      this.$store.dispatch("loader/hide");
    },
    editEmail() {},
    deleteEmail() {},
    editPhone() {},
    deletePhone() {},
    addEmail() {},
    addPhone() {},
    rolesChanged() {},
    handleOk(event) {
      event.preventDefault();
      this.changePassword();
    },
    async getTimeclocks() {
      try {
        const results = await this.api.getData(
          `user/${this.uuid}/timeclock`, {},
          buildHeaders(this.session)
        );
        this.timeclocks = results;
        this.buildTableItems();
      } catch (e) {
        console.log(e);
      }
    },
    buildTableItems() {
      this.items = [];
      for (let clock of this.timeclocks) {
        let hours = "",
          sDate,
          eDate,
          ms;
        let name = clock.User ? FullName(clock.User.Name) : "";
        let project = clock.Project ? clock.Project.Name : "";
        let issue = clock.Issue ? clock.Issue.Title : "";
        if (clock.Start.Date && clock.Start.Time) {
          sDate = new Date(`${clock.Start.Date} ${clock.Start.Time}`);
        }
        if (clock.End.Date && clock.End.Time) {
          eDate = new Date(`${clock.End.Date} ${clock.End.Time}`);
        }
        if (sDate && eDate) {
          ms = eDate.getTime() - sDate.getTime();
          hours = Math.round(ms / 36000) / 100;
        }
        this.items.push({
          uuid: clock.UUID,
          name,
          project,
          issue,
          start_date: clock.Start.Date,
          start_time: clock.Start.Time,
          end_date: clock.End.Date,
          end_time: clock.End.Time,
          hours
        });
      }
      // this.tableKey += 1;
    }
  },
  created() {
    this.uuid = this.$route.params.uuid;
    this.getUser();
    this.getTimeclocks();
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

<style lang="css" scoped></style>
