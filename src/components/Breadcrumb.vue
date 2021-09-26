<template>
  <b-breadcrumb :items="trail" class="m-2 p-1"></b-breadcrumb>
</template>

<script>
export default {
  props: ['trail']
}
</script>