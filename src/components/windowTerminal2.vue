<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-select
          :value.sync="selected"
          :items="serialPorts"
          solo
          dense
          item-text="name"
          item-value="name"
          label="Port Selection"
          @change="selectPort"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          :value-sync="serialBaudate"
          solo
          dense
          label="Baudrate"
          :items="baudrates"
          @change="onBaudrate"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-btn v-if="isSerialOpen" block color="error" @click="closePort"
          >Close</v-btn
        >
        <v-btn v-else block color="success" @click="openPort">Open</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card :id="id" class="overflow-y-auto" :height="nbRows">
          <v-card-text>
            <div v-for="(n, i) in consoleTab" :key="i" :class="n.color">
              {{ n.value }}
            </div>
            <br />
          </v-card-text>
        </v-card>

        <v-text-field
          v-model="input"
          label="Send AT Command"
          hide-details="auto"
          @keyup.enter="onInput()"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

interface Idata {
  innerHeight: number
  innerWidth: number
  nbRows: number
  input: string
  id: any
  portOpen: boolean
  selected: any
  baudrates: Array<number>
}

export default Vue.extend({
  name: 'WindowTerminal2',

  data: (): Idata => ({
    innerHeight: 1080,
    innerWidth: 720,
    nbRows: 500,
    input: '',
    id: '',
    portOpen: false,
    selected: null,
    baudrates: [9600, 115200, 500000],
  }),

  computed: {
    ...mapGetters({
      consoleTab: 'option/getConsoleTab2',
      serial: 'serial/getSerial',
      serialPorts: 'serial/getSerialPorts',
      isSerialOpen: 'serial/isSerialOpen2',
      serialBaudate: 'serial/getSerialBaudate2',
    }),
  },

  destroyed() {},

  created() {},

  mounted() {
    // @ts-ignore
    this.id = 'id_textarea' + '2'

    //
    this.reportWindowSize()
    window.addEventListener('resize', this.reportWindowSize)
  },

  methods: {
    reportWindowSize() {
      this.innerHeight = window.innerHeight
      this.innerWidth = window.innerWidth
      const temp = Math.floor(this.innerHeight / 30)
      this.nbRows = temp * 18

      const textarea = document.getElementById('id_textarea')
      if (textarea !== null) {
        textarea.scrollTop = textarea.scrollHeight
      }
    },

    onBaudrate(baudrate: number) {
      this.closePort()
      this.$store.commit('serial/setSerialBaudate1', baudrate)
    },

    onInput() {
      if (this.isSerialOpen) {
        this.$store.dispatch('serial/writeLine2', this.input)
      }
    },

    initPort() {
      this.$store.dispatch('serial/requestSerial2')
    },

    async selectPort(selected: string) {
      this.closePort()
      if (selected === 'Add port') {
        await this.initPort()
      } else {
        const get = parseInt(selected.split(' ')[1]) - 1
        this.$store.commit('serial/setSerialPort2', this.serialPorts[get].port)
        // console.log(get)
      }
    },

    closePort() {
      if (this.isSerialOpen) {
        this.$store.dispatch('serial/closeSerialPort2')
      }
    },

    openPort() {
      this.$store.dispatch('serial/openSerialPort2')
    },
  },
})
</script>
