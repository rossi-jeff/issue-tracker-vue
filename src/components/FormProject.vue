<template>
  <div>
    <b-row class="m-4">
        <b-col>
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text>
                Name
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input v-validate="'required|min:6'" name="Name" v-model="project.Name" :disabled="!enabled"></b-form-input>
          </b-input-group>
          <div class="vee-validate-error p-1">{{ errors.first('Name') }}</div>
        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>
          <b-form-group label="Details" label-for="Details">
            <b-form-textarea v-validate="'required|min:6'" name="Details" id="Details" v-model="project.Details" :disabled="!enabled"></b-form-textarea>
          </b-form-group>
          <div class="vee-validate-error p-1">{{ errors.first('Details') }}</div> 
        </b-col>
      </b-row>
  </div>
</template>

<script>
export default {
  props: ['project','enabled']
}
</script>