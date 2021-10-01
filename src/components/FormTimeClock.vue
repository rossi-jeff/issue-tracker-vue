<template lang="html">
  <div class="form-time-clock">
    <b-row class="m-4">
      <b-col>
        <div>
          <strong>Project</strong>
        </div>
        <b-form-select
          v-model="timeclock.ProjectId"
          :options="options.projects"
          style="width: 100%"
          class="p-1 my-1"
          @change="projectChanged"
          :disabled="!session.signedIn"
        ></b-form-select>
      </b-col>
      <b-col>
        <div>
          <strong>Issue</strong>
        </div>
        <b-form-select
          v-model="timeclock.IssueId"
          :options="options.issues"
          style="width: 100%"
          class="p-1 my-1"
          @change="issueChanged"
          :disabled="!session.signedIn"
        ></b-form-select>
      </b-col>
    </b-row>
    <b-row class="m-4">
      <b-col>
        <div>
          <strong>Start Date</strong>
        </div>
        <b-form-datepicker
          v-model="timeclock.Start.Date"
          today-button
          :disabled="!session.signedIn"
        ></b-form-datepicker>
      </b-col>
      <b-col>
        <div>
          <strong>Start Time</strong>
        </div>
        <b-form-timepicker
          v-model="timeclock.Start.Time"
          now-button
          :disabled="!session.signedIn"
        ></b-form-timepicker>
      </b-col>
      <b-col>
        <div>
          <strong>End Date</strong>
        </div>
        <b-form-datepicker
          v-model="timeclock.End.Date"
          today-button
          :disabled="!session.signedIn"
        ></b-form-datepicker>
      </b-col>
      <b-col>
        <div>
          <strong>End Time</strong>
        </div>
        <b-form-timepicker
          v-model="timeclock.End.Time"
          now-button
          :disabled="!session.signedIn"
        ></b-form-timepicker>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["timeclock", "options", "session"],
  methods: {
    projectChanged() {
      this.$emit("projectChanged");
    },
    issueChanged() {
      this.$emit("issueChanged");
    }
  }
};
</script>

<style lang="css" scoped></style>
