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
          v-model="baudrate"
          solo
          dense
          label="Baudrate"
          :items="baudrates"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-btn v-if="portOpen" block color="error" @click="closePort"
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
        <br />

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
  readerStop: any
  writerStop: any
  reader: any
  writer: any
  input: string
  id: any
  port: any
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
    readerStop: null,
    writerStop: null,
    reader: null,
    writer: null,
    input: '',
    id: '',
    port: null,
    portOpen: false,
    selected: null,
    baudrate: 9600,
    baudrates: [9600, 115200, 500000],
  }),

  computed: {
    ...mapGetters({
      consoleTab1: 'option/getConsoleTab1',
      consoleTab2: 'option/getConsoleTab2',
      serial: 'serial/getSerial',
      ports: 'serial/getSerialPorts',
    }),
  },

  destroyed() {},

  created() {},

  mounted() {
    // @ts-ignore
    this.id = 'id_textarea' + this._uid

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

      const textarea = document.getElementById(this.id)
      if (textarea !== null) {
        textarea.scrollTop = textarea.scrollHeight
      }
    },

    async onInput() {
      if (this.portOpen) {
        await this.writer.write(this.input + '\r\n')
      }
      this.$store.commit('option/addConsoleText' + this.init, this.input)
    },

    async initPort() {
      await this.serial
        .requestPort()
        .then((port: any) => {
          this.$store.commit('serial/setSerialPort', port)
          this.port = port
          // Connect to `port` or add it to the list of available ports.
        })
        .catch((e: any) => {
          alert(e)
          // The user didn't select a port.
        })
    },

    async selectPort(selected: string) {
      if (selected === 'Add port') {
        await this.initPort()
      } else {
        const get = parseInt(selected.split(' ')[1]) - 1
        this.port = this.ports[get].port
        console.log(this.port)
      }
    },

    async closePort() {
      try {
        await this.reader.cancel()
        await this.readerStop.catch(() => {
          /* Ignore the error */
        })

        await this.writer.close()
        await this.writerStop

        await this.port.close()
      } catch (e) {
        alert('erre')
      }
      this.portOpen = false
    },

    async openPort() {
      // await this.initPort()
      // Class for Streams
      class LineBreakTransformer {
        chunks: any

        constructor() {
          // A container for holding stream data until a new line.
          this.chunks = ''
        }

        transform(chunk: any, controller: any) {
          // Append new chunks to existing chunks.
          this.chunks += chunk
          // For each line breaks in chunks, send the parsed lines out.
          const lines = this.chunks.split('\r\n')
          this.chunks = lines.pop()
          lines.forEach((line: string) => controller.enqueue(line))
        }

        flush(controller: any) {
          // When the stream is closed, flush any remaining chunks out.
          controller.enqueue(this.chunks)
        }
      }

      // Open Port
      await this.port.open({ baudRate: this.baudrate })

      this.portOpen = true

      // Stream Rx
      const textDecoder = new TextDecoderStream()
      this.readerStop = this.port.readable.pipeTo(textDecoder.writable)
      this.reader = textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader()

      // Stream Tx
      const textEncoder = new TextEncoderStream()
      this.writerStop = textEncoder.readable.pipeTo(this.port.writable)
      this.writer = textEncoder.writable.getWriter()

      // Listen to data coming from the serial device.
      while (true) {
        const { value, done } = await this.reader.read()
        if (done) {
          // Allow the serial port to be closed later.
          this.reader.releaseLock()
          break
        }
        this.$store.commit('option/addConsoleText' + this.init, value)

        const textarea = document.getElementById(this.id)
        if (textarea !== null) {
          textarea.scrollTop = textarea.scrollHeight
        }
      }
    },
  },
})
</script>
