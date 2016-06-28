<style scoped>
  .exclamation-list {
    background-color: #FAFAFA;
    border: 2px solid #222;
    border-radius: 7px;
  }

  .exclamation-list h1 {
    font-size: 1.5em;
    text-align: center;
  }

  .exclamation:nth-child(2) {
    border-top: 1px solid #222;
  }

  .exclamation {
    padding: 5px;
    border-bottom: 1px solid #222;
  }

  .user {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }
</style>

<template>
  <div class="exclamation-list">
    <h1>{{ title }}</h1>
    <div class="exclamation" v-for='exclamation in exclamations' :key='exclamation.id'>
      <p class="user">{{ exclamation.user }}</p>
      <p class="text">{{ exclamation.text }}</p>
      <button v-on:click='onRemoveClicked(exclamation.id)' v-if='canDelete(exclamation.user)' class="btn btn-danger">Remove</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      exclamations: {
        type: Array,
        default: () => ([]),
      },
      onRemove: {
        default: () => {},
      },
      user: {
        default: {},
      },
    },
    methods: {
      onRemoveClicked(id) {
        this.onRemove(id);
      },
      canDelete(user) {
        return this.user.scopes.includes('delete') || this.user.username === user;
      },
    },
  };
</script>
