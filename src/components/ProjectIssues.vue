<template>
  <div>
    <b-card no-body border-variant="dark" header-bg-variant="light" class="m-2" header-tag="header">

      <template #header>
        <h6 class="mb-0" style="cursor: pointer" @click="issuesVisible = !issuesVisible">Issues ({{ issues.length }})</h6>
      </template>

      <b-collapse v-model="issuesVisible" id="project-issues-collapse" class="p-4">
        <IssueCard 
          v-for="(issue,index) of issues"
          :key="index"
          :issue="issue"
        />
      </b-collapse>

    </b-card>
  </div>
</template>

<script>
import IssueCard from '@/components/IssueCard'
export default {
  props: ['issues'],
  components: {
    IssueCard
  },
  data: () => ({
    issuesVisible: false
  })
}
</script>

<style>
#project-issues-collapse {
  max-height: 500px;
  overflow-y: auto;
}
</style>