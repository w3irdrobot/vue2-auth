<template>
  <div>
    <div class="input-container">
      <div class="form-group">
        <label for='searchTerm'>Search:</label>
        <input v-model='searchTerm' type="text" class='form-control' placeholder="Search term">
      </div>
    </div>
    <Exclamation-List :user='user' :onRemove='onRemove' title='Filtered Exclamations' :exclamations='exclamationsToShow'></Exclamation-List>
  </div>
</template>

<script>
  import ExclamationList from './exclamation_list.vue';

  export default {
    data() {
      return {
        searchTerm: '',
      };
    },
    props: {
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
    computed: {
      exclamationsToShow() {
        let filteredExclamations = this.exclamations;

        this.searchTerm.split(' ')
          .map(t => t.split(':'))
          .forEach(([type, query]) => {
            if (!query) return;

            if (type === 'user') {
              filteredExclamations = filteredExclamations.filter(e => e.user.match(query));
            } else if (type === 'contains') {
              filteredExclamations = filteredExclamations.filter(e => e.text.match(query));
            }
          });

        return filteredExclamations;
      },
    },
    components: {
      ExclamationList,
    },
  };
</script>
