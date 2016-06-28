<style>
</style>

<template>
  <div class="row">
    <div class="col-md-4">
      <Exclamation-List title='All Exclamations' :exclamations='exclamations'></Exclamation-List>
    </div>
    <div class="col-md-4">
      <Exclamation-List title='Your Exclamations' :exclamations='userExclamations'></Exclamation-List>
    </div>
    <div class="col-md-4">
      ExclamationList3
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import ExclamationList from './exclamation_list.vue';

  export default {
    name: 'ExclamationsViewer',
    data: () => ({
      user: {},
      exclamations: [],
    }),
    beforeMount() {
      Promise.all([
        axios.get('/api/me'),
        axios.get('/api/exclamations'),
      ]).then(([{ data: meData }, { data: exclamationData }]) => {
        this.user = meData.user;
        this.exclamations = exclamationData.exclamations;
      });
    },
    computed: {
      userExclamations: function() {
        return this.exclamations.filter(exc => exc.user === this.user.username);
      },
    },
    components: {
      ExclamationList,
    },
  };
</script>
