<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-select
          :value.sync="selected"
          :items="ports"
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
          :value-sync="baudrate"
          solo
          dense
          label="Baudrate"
          :items="baudrates"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-btn v-if="isSerialOpen1" block color="error" @click="closePort"
          >Close</v-btn
        >
        <v-btn v-else block color="success" @click="openPort">Open</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card :id="id" class="overflow-y-auto" :height="nbRows">
          <v-card-text v-if="init === '1'">
            <div v-for="(n, i) in consoleTab1" :key="i" :class="n.color">
              {{ n.value }}
            </div>
            <br />
          </v-card-text>
          <v-card-text v-else>
            <div v-for="(n, i) in consoleTab2" :key="i" :class="n.color">
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
  baudrate: number
  baudrates: Array<number>
}

export default Vue.extend({
  name: 'WindowTerminal',

  props: {
    init: String,
  },

  data: (): Idata => ({
    innerHeight: 1080,
    innerWidth: 720,
    nbRows: 500,
    input: '',
    id: '',
    portOpen: false,
    selected: null,
    baudrate: 9600,
    baudrates: [9600, 115200, 500000],
  }),

  computed: {
    ...mapGetters({
      consoleTab1: 'option/getConsoleTab1',
      consoleTab2: 'option/getConsoleTab2',
      isSerialOpen1: 'serial/isSerialOpen1',
      serial: 'serial/getSerial',
      ports: 'serial/getSerialPorts',
    }),
  },

  destroyed() {},

  created() {},

  mounted() {
    // @ts-ignore
    this.id = 'id_textarea' + this.init

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

    onInput() {
      if (this.isSerialOpen1) {
        this.$store.dispatch('serial/writeLine1', this.input)
      }
    },

    initPort() {
      this.$store.dispatch('serial/requestSerial1', this.init)
    },

    async selectPort(selected: string) {
      if (selected === 'Add port') {
        await this.initPort()
      } else {
        const get = parseInt(selected.split(' ')[1]) - 1
        // this.port = this.ports[get].port
        this.$store.commit('serial/setSerialPort1', this.ports[get].port)
        console.log(get)
      }
    },

    closePort() {
      this.$store.dispatch('serial/closeSerialPort1', {
        index: this.init,
      })
    },

    openPort() {
      this.$store.dispatch('serial/openSerialPort1', {
        index: this.init,
      })
    },
  },
})
</script>
