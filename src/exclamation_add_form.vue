<template>
  <form class="form-inline" v-on:submit.prevent='onFormSubmit'>
    <div class="form-group">
      <label for='exclamationText'>Exclamation</label>
      <textarea cols="30" rows="2" class="form-control" placeholder="Enter exclamation here." v-model='exclamationText'></textarea>
    </div>
    <input type="submit" value="Submit" class="btn btn-success">
  </form>
</template>

<script>
  export default {
    data() {
      return {
        exclamationText: '',
      };
    },
    props: ['onAdd'],
    methods: {
      onFormSubmit() {
        this.onAdd(this.exclamationText);
        this.exclamationText = '';
      },
    },
  };
</script>
