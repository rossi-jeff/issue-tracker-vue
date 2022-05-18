<template lang="html">
  <div class="table-time-clock">
    <b-card
      no-body
      border-variant="dark"
      header-bg-variant="light"
      class="m-2"
      header-tag="header"
    >
      <template #header>
        <h6
          class="mb-0"
          style="cursor: pointer"
          @click="tableVisible = !tableVisible"
        >
          Time Clock ({{ items.length }})
        </h6>
      </template>

      <b-collapse v-model="tableVisible" id="time-clock-collapse">
        <b-table sticky-header striped hover :fields="fields" :items="items">
          <template #cell(uuid)="data">
            <b-button :to="`/time_clock/${data.value}`" size="sm">
              <b-icon icon="pencil-square"></b-icon>
            </b-button>
          </template>
          <template #cell(delete)="data">
            <b-button @click="deleteClicked(data.value)">
              <b-icon icon="trash"></b-icon>
            </b-button>
          </template>
        </b-table>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  props: ["items", "fields"],
  data: () => ({
    tableVisible: false
  }),
  methods: {
    deleteClicked(UUID) {
      this.$emit("deleteClicked", UUID);
    }
  }
};
</script>

<style lang="css">
.nowrap {
  white-space: nowrap;
}
.ellipsis {
  max-width: 16em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ellipsis:hover {
  white-space: normal;
}
</style>
