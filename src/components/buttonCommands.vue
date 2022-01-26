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
  <!-- <v-btn
          color="error"
          class="mx-0 mb-3 pa-0"
          block
          @click="commandClik"
        >
          Stop file saving
        </v-btn>
        <v-btn
          color="error"
          class="mx-0 mb-3 pa-0"
          block
          @click="stopFileSaving"
        >
          Stop file saving
        </v-btn> -->
  <!-- <v-container v-if="timeText" fluid>
          <v-btn
            elevation="2"
            color="error"
            x-large
            block
            @click="stopTimeText"
          >
            No Time Text
          </v-btn>
        </v-container>
        <v-container v-else fluid>
          <v-btn
            elevation="2"
            color="primary"
            x-large
            block
            @click="startTimeText"
          >
            Add Time Text
          </v-btn>
        </v-container>
        <v-container v-if="isFile === false" fluid>
          <v-btn
            elevation="2"
            color="normal"
            x-large
            block
            @click="getFileExemple"
          >
            Get File Exemple
          </v-btn>
        </v-container>
        <v-container v-if="isFile === false" fluid>
          <v-input x-large block> </v-input>
          <v-file-input
            truncate-length="15"
            accept=".json"
            outlined
            label="File input"
            @change="setFileCommands"
          ></v-file-input>
        </v-container>
        <div v-if="isFile === true">
          <v-container v-for="i in file" :key="i.key" fluid>
            <v-btn
              elevation="2"
              color="normal"
              x-large
              block
              @click="setButtonCommand(i)"
            >
              {{ i.key }}
            </v-btn>
          </v-container>
        </div>-->
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
          if (tempCmd[j].startsWith('/!')) {
            const temp = tempCmd[j].split(':')
            if (temp[0].toLowerCase() === '/!delay') {
              await this.cmdDelay(parseInt(temp[1]))
            }
          } else {
            console.log(tempCmd[j] + '\r\n')
            this.$store.dispatch('serial/writeLine1', tempCmd[j])
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
