import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

// bootstrap-vue
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import '../src/styles/libs/fontawesome/css/all.min.css'

// vue-multiselect
import 'vue-multiselect/dist/vue-multiselect.min.css'

// mixins
import Mixins from '../src/mixins'
Vue.mixin(Mixins)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}