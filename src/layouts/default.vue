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
          v-for="item in items0"
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

          <v-list-item-action>
            <v-switch :value.sync="item.switch"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items1" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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

interface Idata {
  title: string
  version: string
  drawnerL: boolean
  items0: any
  items1: any
  switch1: boolean
  lastItem: any
}
export default Vue.extend({
  name: 'DefaultLayout',

  data: (): Idata => ({
    title: 'Nuxt Terminal',
    version: 'V1.0.4',
    drawnerL: false,
    items0: [
      { title: 'Add time', switch: false, icon: 'mdi-view-dashboard' },
      { title: 'Commands', switch: false, icon: 'mdi-view-dashboard' },
      { title: 'Dual mode', switch: false, icon: 'mdi-view-dashboard' },
      { title: 'Save logs', switch: false, icon: 'mdi-image' },
      { title: 'Uart color', switch: false, icon: 'mdi-help-box' },
    ],
    items1: [
      { title: 'Get Commands File', icon: 'mdi-view-dashboard' },
      { title: 'Set Commands File', icon: 'mdi-view-dashboard' },
    ],
    switch1: false,
    lastItem: {
      switch: false,
      title: '',
    },
  }),

  computed: {
    ...mapGetters({
      serial: 'serial/getSerial',
      port: 'serial/getSerialPort',
      ports: 'serial/getSerialPorts',
    }),
  },

  mounted() {
    // @ts-ignore
    this.$store.commit('serial/setSerial', navigator.serial)
    this.serial.addEventListener('connect', () => {
      this.addPorts()
    })
    this.serial.addEventListener('disconnect', () => {
      this.addPorts()
    })
    this.addPorts()
  },

  methods: {
    addPorts() {
      this.serial.getPorts().then((ports: any) => {
        const myPortsWithName = []
        for (let i = 0; i < ports.length; i++) {
          myPortsWithName.push({
            name: 'Port ' + (i + 1),
            port: ports[i],
          })
        }
        myPortsWithName.push({
          name: 'Add port',
          port: null,
        })
        this.$store.commit('serial/setSerialPorts', myPortsWithName)
      })
    },

    async setSaveText(value: boolean) {
      if (value === true) {
        // @ts-ignore create a new handle
        const newHandle = await window.showSaveFilePicker()

        // create a FileSystemWritableFileStream to write to
        const myWritableStream = await newHandle.createWritable()
        this.$store.commit('option/setWritableStream', myWritableStream)

        // close the file and write the contents to disk.
        window.onbeforeunload = () => {
          this.$store.commit('option/setOptionFileTxt', false)
        }
        this.$store.commit('option/setOptionFileTxt', true)
      } else {
        this.$store.commit('option/setOptionFileTxt', false)
      }
    },

    async onSwitch1() {},

    async onSwitch(item: any) {
      console.log(item)
      item.switch = !item.switch

      switch (item.title) {
        case 'Add time':
          this.$store.commit('option/setOptionAddTime', item.switch)
          break

        case 'Commands':
          this.$store.commit('option/setOptionCommands', item.switch)
          break

        case 'Dual mode':
          this.$store.commit('option/setOptionDuoMode', item.switch)
          break

        case 'Save logs':
          await this.setSaveText(item.switch)
          break

        case 'Uart color':
          this.$store.commit('option/setOptionUartColor', item.switch)
          break

        default:
          break
      }
    },

    switchDrawnerL() {
      this.drawnerL = !this.drawnerL
    },

    // async setSaveText(value: boolean) {
    //   this.isSaveTxt = value
    //   if (this.isSaveTxt === true) {
    //     // create a new handle
    //     // @ts-ignore
    //     const newHandle = await window.showSaveFilePicker()

    //     // create a FileSystemWritableFileStream to write to
    //     this.writableStream = await newHandle.createWritable()

    //     // close the file and write the contents to disk.
    //     window.onbeforeunload = () => {
    //       this.writableStream.close()
    //       this.isSaveTxt = false
    //     }
    //   } else {
    //     // close the file and write the contents to disk.
    //     await this.writableStream.close()
    //     window.onbeforeunload = () => {}
    //   }
    // },
  },
})
</script>
