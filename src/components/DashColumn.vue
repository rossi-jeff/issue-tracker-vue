<template lang="html">
  <div class="dash-column" :id="`dash-column-${status}`">
    <b-card
      :header="status"
      border-variant="dark"
      header-bg-variant="light"
      class="m-1"
    >
      <b-card-text class="dash-column-body">
        <DashIssue
          v-for="issue in issues"
          :key="issue.Id"
          :issue="issue"
          :id="issue.UUID"
          :session="session"
          :draggable="draggable"
          @loaded="draggableLoaded"
        />
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import DashIssue from "@/components/DashIssue";

export default {
  props: ["issues", "draggable", "droppable", "status", "session"],
  components: {
    DashIssue
  },
  methods: {
    enableDrop() {
      if (!this.droppable) return;
      let target = document.getElementById(`dash-column-${this.status}`);
      if (target) {
        target.addEventListener("drop", this.handleDrop);
        target.addEventListener("dragover", this.handleDragOver);
      }
    },
    handleDragStart(ev) {
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.dropEffect = "copy";
    },
    handleDragOver(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    },
    handleDrop(ev) {
      ev.preventDefault();
      const uuid = ev.dataTransfer.getData("text/plain");
      const { status } = this;
      this.$emit("dropped", {
        uuid,
        status
      });
      setTimeout(() => {
        this.draggableLoaded(uuid);
      }, 100);
    },
    draggableLoaded(uuid) {
      const el = document.getElementById(uuid);
      if (el && el.draggable) {
        el.addEventListener("dragstart", this.handleDragStart);
      }
    }
  },
  mounted() {
    this.enableDrop();
  }
};
</script>

<style lang="css" scoped></style>
