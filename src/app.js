import Vue from 'vue';
import ExclamationsViewer from './exclamations_viewer.vue';

new Vue({
  el: '#app-container',
  data: {
    exclamations: [],
  },
  render(createElement) {
    return createElement(ExclamationsViewer);
  },
});
