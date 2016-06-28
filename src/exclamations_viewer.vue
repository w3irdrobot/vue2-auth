<style>
  .exclamations-viewer,
  .add-form-container {
    margin-top: 20px;
  }
</style>

<template>
  <div class="container">
    <div class="row add-form-container" v-if='canAdd()'>
      <div class="col-md-12">
        <Exclamation-Add-Form :onAdd='onExclamationAdded'></Exclamation-Add-Form>
      </div>
    </div>
    <div class="row exclamations-viewer">
      <div class="col-md-4">
        <Exclamation-List :user='user' :onRemove='onExclamationRemoved' title='All Exclamations' :exclamations='exclamations'></Exclamation-List>
      </div>
      <div class="col-md-4">
        <Exclamation-List :user='user' :onRemove='onExclamationRemoved' title='Your Exclamations' :exclamations='userExclamations'></Exclamation-List>
      </div>
      <div class="col-md-4">
        <Exclamation-Search-List :user='user' :onRemove='onExclamationRemoved' :exclamations='exclamations'></Exclamation-Search-List>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import ExclamationList from './exclamation_list.vue';
  import ExclamationSearchList from './exclamation_search_list.vue';
  import ExclamationAddForm from './exclamation_add_form.vue';

  export default {
    name: 'ExclamationsViewer',
    data: () => ({
      user: {
        scopes: [],
      },
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
    methods: {
      onExclamationAdded(text) {
        axios.post('/api/exclamations', { text }).then(({ data }) => {
          this.exclamations = [data.exclamation].concat(this.exclamations);
        });
      },
      canAdd() {
        return this.user.scopes.includes('add');
      },
      onExclamationRemoved(id) {
        axios.delete(`/api/exclamations/${id}`)
          .then(() => {
            this.exclamations = this.exclamations.filter(e => e.id !== id);
          });
      },
    },
    computed: {
      userExclamations() {
        return this.exclamations.filter(exc => exc.user === this.user.username);
      },
    },
    components: {
      ExclamationList,
      ExclamationSearchList,
      ExclamationAddForm,
    },
  };
</script>
