<template>
  <v-app dark>
    <v-navigation-drawer
      :value.sync="drawnerL"
      disable-resize-watcher
      fixed
      app
      :width="300"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Nuxt Terminal </v-list-item-title>
          <v-list-item-subtitle> {{ version }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in optionItems"
          :key="item.title"
          link
          @click="onSwitch(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon v-if="item.switch">{{ item.iconOn }}</v-icon>
            <v-icon v-else>{{ item.iconOff }}</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item link @click="getFileExemple">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Get Commands File </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-file-input
              truncate-length="15"
              accept=".json"
              outlined
              dense
              label="Set Commands File"
              @change="setFileCommands"
            ></v-file-input>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
    </v-navigation-drawer>

    <v-app-bar dense fixed app>
      <v-app-bar-nav-icon @click.stop="switchDrawnerL" />
      <v-spacer />
      {{ title }}
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span> {{ version }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

import fileDownload from 'js-file-download'

import pjson from '../../package.json'

interface Idata {
  title: string
  version: string
  drawnerL: boolean
  items1: any
  lastItem: any
}
export default Vue.extend({
  name: 'DefaultLayout',

  data: (): Idata => ({
    title: 'Nuxt Terminal',
    version: 'V' + pjson.version,
    drawnerL: false,
    items1: [
      { title: '', icon: '' },
      { title: '', icon: 'mdi-view-dashboard' },
    ],
    lastItem: {
      switch: false,
      title: '',
    },
  }),

  computed: {
    ...mapGetters({
      optionDuoMode: 'option/isOptionDuoMode',
      optionItems: 'option/getItems',
    }),
  },

  mounted() {
    this.$store.dispatch('serial/initSerial')

    window.onbeforeunload = () => {
      this.$store.commit('option/clearConsoleText1', false)
      this.$store.commit('option/clearConsoleText2', false)
      this.$store.commit('option/setOptionFileTxt', false)
    }
  },

  methods: {
    async setSaveText(value: boolean) {
      if (value === true) {
        // @ts-ignore create a new handle
        const newHandle = await window.showSaveFilePicker()

        // create a FileSystemWritableFileStream to write to
        const myWritableStream = await newHandle.createWritable()
        this.$store.commit('option/setWritableStream', myWritableStream)

        // close the file and write the contents to disk.
        this.$store.commit('option/setOptionFileTxt', true)
      } else {
        this.$store.commit('option/setOptionFileTxt', false)
      }
    },

    async onSwitch(item: any) {
      switch (item.title) {
        case 'Add time':
          this.$store.commit('option/setOptionAddTime', !item.switch)
          break

        case 'Commands':
          this.$store.commit('option/setOptionCommands', !item.switch)
          break

        case 'Dual mode':
          this.$store.commit('option/setOptionDuoMode', !item.switch)
          break

        case 'Save logs':
          await this.setSaveText(!item.switch)
          break

        case 'Uart color':
          this.$store.commit('option/setOptionUartColor', !item.switch)
          break

        default:
          break
      }
    },

    switchDrawnerL() {
      this.drawnerL = !this.drawnerL
    },

    getFileExemple() {
      if (this.optionDuoMode) {
        const myConfig = [
          {
            name: 'Example Duo 1',
            cmd: [
              {
                type: 'serial',
                value: 'AT',
                window: 1,
                times: 3,
                delay: 50,
              },
              {
                type: 'serial',
                value: 'ATI5',
                window: 1,
              },
              {
                type: 'serial',
                value: 'ATI13',
                window: 1,
              },
              {
                type: 'delay',
                value: '1000',
              },
            ],
          },
          {
            name: 'Example Duo 2',
            cmd: [
              {
                type: 'serial',
                value: 'AT',
                window: 2,
                times: 3,
                delay: 50,
              },
              {
                type: 'serial',
                value: 'ATI5',
                window: 2,
              },
              {
                type: 'serial',
                value: 'ATI13',
                window: 2,
              },
              {
                type: 'delay',
                value: '1000',
              },
            ],
          },
          {
            name: 'Example Duo 3',
            cmd: [
              {
                type: 'clear',
              },
              {
                type: 'serial',
                value: 'AT',
                window: 2,
              },
              {
                type: 'serial',
                value: 'AT',
                window: 1,
                times: 3,
                delay: 50,
              },
              {
                type: 'serial',
                value: 'ATI5',
                window: 2,
              },
              {
                type: 'serial',
                value: 'ATI5',
                window: 1,
              },
              {
                type: 'serial',
                value: 'ATI13',
                window: 1,
              },
              {
                type: 'serial',
                value: 'ATI13',
                window: 2,
              },
              {
                type: 'delay',
                value: '1000',
              },
            ],
          },
        ]
        fileDownload(JSON.stringify(myConfig), 'config.json')
      } else {
        const myConfig = [
          {
            name: 'Example 1',
            cmd: [
              {
                type: 'serial',
                value: 'AT',
              },
              {
                type: 'serial',
                value: 'ATI5',
              },
              {
                type: 'serial',
                value: 'ATI13',
              },
            ],
          },
          {
            name: 'Example 2',
            cmd: [
              {
                type: 'clear',
              },
              {
                type: 'serial',
                value: 'AT',
              },
              {
                type: 'serial',
                value: 'ATI5',
              },
              {
                type: 'serial',
                value: 'ATI13',
              },
              {
                type: 'delay',
                value: '1000',
              },
            ],
            times: 2,
          },
        ]
        fileDownload(JSON.stringify(myConfig), 'config.json')
      }
    },

    setFileCommands(file: File) {
      const reader = new FileReader()
      reader.onload = (evt: any) => {
        this.drawnerL = false
        const temp = JSON.parse(evt.target.result)
        this.$store.commit('commands/clearCommands')
        for (let i = 0; i < temp.length; i++) {
          this.$store.commit('commands/setCommands', {
            name: temp[i].name,
            value: temp[i],
          })
        }
        this.$store.commit('commands/setCommandsPad')
      }
      reader.readAsText(file)
    },
  },
})
</script>
