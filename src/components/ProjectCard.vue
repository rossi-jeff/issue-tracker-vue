<template id="project-card">
<div class="project-card">
  <b-card border-variant="dark" header-bg-variant="light" class="mx-2 mb-2" :header="project.Name">
    <b-card-text>{{ project.Details }}</b-card-text>

    <b-button variant="outline-primary" size="sm" :to="{ name: 'ProjectDetail', params: { uuid: project.UUID } }">
      <b-icon icon="pencil-square"></b-icon>
      Edit
    </b-button>
  </b-card>
</div>
</template>

<script type="text/javascript">
export default {
  props: ['project']
}
</script>
