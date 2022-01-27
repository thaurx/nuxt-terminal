<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-btn dense block @click="decreasePage">
          <v-icon left> mdi-arrow-left-bold </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <div>
          <h2 class="text-center">{{ page }}</h2>
        </div>
      </v-col>
      <v-col cols="4">
        <v-btn dense block @click="increasePage">
          <v-icon left> mdi-arrow-right-bold </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-6 pt-7">
      <v-col cols="12">
        <v-card elevation="2" color="grey">
          <v-row class="mx-0" style="overflow: hidden">
            <v-col cols="12">
              <v-btn
                v-for="(item, index) in commands.slice(
                  10 * page + 0,
                  10 * page + 10
                )"
                :key="index"
                class="mx-0 mb-3 pa-0"
                block
                @click="commandClik(10 * page + index)"
              >
                {{ item.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

interface Idata {
  page: number
  pageMax: number
}

export default Vue.extend({
  name: 'ButtonCommands',

  data: (): Idata => ({
    page: 0,
    pageMax: 1,
  }),

  computed: {
    ...mapGetters({
      optionDuoMode: 'option/isOptionDuoMode',
      commands: 'commands/getCommands',
      isSerialOpen1: 'serial/isSerialOpen1',
      isSerialOpen2: 'serial/isSerialOpen2',
    }),
  },

  destroyed() {},

  created() {},

  mounted() {},

  methods: {
    decreasePage() {
      if (this.page > 0) this.page--
    },

    increasePage() {
      if (this.page < this.pageMax) this.page++
    },

    cmdDelay(timeMs: number) {
      return new Promise((resolve) => setTimeout(resolve, timeMs))
    },

    async setButtonCommand(item: any) {
      const tempCmd = item.value.cmd
      const tempTimes = item.value.times
      for (let i = 0; i < tempTimes; i++) {
        for (let j = 0; j < tempCmd.length; j++) {
          if (tempCmd[j].type === 'serial') {
            if (tempCmd[j].window && tempCmd[j].window === 2) {
              this.$store.dispatch('serial/writeLine2', tempCmd[j].value)
            } else {
              this.$store.dispatch('serial/writeLine1', tempCmd[j].value)
            }
          } else if (tempCmd[j].type === 'delay') {
            await this.cmdDelay(tempCmd[j].value)
          } else if (tempCmd[j].type === 'clear') {
            if (tempCmd[j].value === 1) {
              this.$store.commit('option/clearConsoleText1', false)
            } else if (tempCmd[j].value === 2) {
              this.$store.commit('option/clearConsoleText2', false)
            } else {
              this.$store.commit('option/clearConsoleText1', false)
              this.$store.commit('option/clearConsoleText2', false)
            }
          }
        }
      }
    },

    async commandClik(index: number) {
      await this.setButtonCommand(this.commands[index])
    },
  },
})
</script>
