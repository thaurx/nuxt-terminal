<template>
  <v-card outlined color="transparent">
    <v-row v-if="optionCommands">
      <v-col cols="9">
        <v-row v-if="optionDuoMode">
          <v-col cols="6">
            <WindowTerminal1 />
          </v-col>
          <v-col cols="6">
            <WindowTerminal2 />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <WindowTerminal1 />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <ButtonCommands />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-row v-if="optionDuoMode">
          <v-col cols="6">
            <WindowTerminal1 />
          </v-col>
          <v-col cols="6">
            <WindowTerminal2 />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <WindowTerminal1 />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

import ButtonCommands from '../components/buttonCommands.vue'
import WindowTerminal1 from '../components/windowTerminal1.vue'
import WindowTerminal2 from '../components/windowTerminal2.vue'

interface Idata {}

export default Vue.extend({
  name: 'FirstPage',

  components: {
    ButtonCommands,
    WindowTerminal1,
    WindowTerminal2,
  },

  data: (): Idata => ({}),

  computed: {
    loaded() {
      return (
        this.$store.state.localStorage.status &&
        this.$store.state.sessionStorage.status
      )
    },
    ...mapGetters({
      optionCommands: 'option/isOptionCommands',
      optionDuoMode: 'option/isOptionDuoMode',
    }),
  },

  destroyed() {},

  created() {},

  mounted() {},

  methods: {
    onClear() {
      this.$store.commit('clearConsoleText')
    },
  },
})
</script>
