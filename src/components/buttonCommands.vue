<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-btn dense block @click="decreasePage"><</v-btn>
      </v-col>
      <v-col cols="4">
        <div>
          <h2 class="text-center">{{ page }}</h2>
        </div>
      </v-col>
      <v-col cols="4">
        <v-btn dense block @click="increasePage">></v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-6 pt-7">
      <v-col cols="12">
        <v-card elevation="2" color="grey">
          <v-row class="mx-0" style="overflow: hidden">
            <!-- Add `overflow: hidden;` here! -->

            <v-col cols="12">
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
              </v-btn>
              <v-btn class="mx-0 mb-3 pa-0" block @click="stopFileSaving">
                -
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
          @click="stopFileSaving"
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

import fileDownload from 'js-file-download'

interface Idata {
  isFile: boolean
  file: Array<any>
  page: number
  pageMax: number
}

export default Vue.extend({
  name: 'ButtonCommands',

  data: (): Idata => ({
    isFile: false,
    file: [],
    page: 0,
    pageMax: 1,
  }),

  computed: {
    ...mapGetters({
      optionDuoMode: 'option/isOptionDuoMode',
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

    getFileExemple() {
      if (this.optionDuoMode) {
        const myConfig = [
          {
            name: 'AT',
            cmd: ['AT\r\n', '/!delay:100', 'ATI13\r\n', '/!delay:1000'],
            times: 2,
            serialIndex: 1,
          },
          {
            name: 'AT',
            cmd: ['AT\r\n', '/!delay:100', 'ATI13\r\n', '/!delay:1000'],
            times: 2,
            serialIndex: 2,
          },
        ]
        fileDownload(JSON.stringify(myConfig), 'config.json')
      } else {
        const myConfig = [
          {
            name: 'AT',
            cmd: ['AT\r\n', '/!delay:100', 'ATI13\r\n', '/!delay:1000'],
            times: 2,
          },
          {
            name: 'AT',
            cmd: ['AT\r\n', '/!delay:100', 'ATI13\r\n', '/!delay:1000'],
            times: 2,
          },
        ]
        fileDownload(JSON.stringify(myConfig), 'config.json')
      }
    },

    setFileCommands(file: File) {
      const reader = new FileReader()
      reader.onload = (evt: any) => {
        const temp = JSON.parse(evt.target.result)
        for (let i = 0; i < temp.length; i++) {
          this.file.push({ key: temp[i].name, value: temp[i] })
        }

        this.isFile = true
      }
      reader.readAsText(file)
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
            // await this.writer.write(tempCmd[j] + '\r\n')
          }
        }
      }
    },
  },
})
</script>
