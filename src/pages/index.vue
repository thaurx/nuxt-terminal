<template>
  <v-container v-if="isStart === false" class="ma-0 pa-0" fluid>
    <v-btn v-if="port === null" elevation="2" x-large block @click="initPort">
      Get your port
    </v-btn>
    <v-select
      v-if="port !== null"
      v-model="baudrate"
      label="L3lan Home Selection"
      :items="baudrates"
      outlined
    ></v-select>
    <v-btn v-if="port !== null" elevation="2" x-large block @click="startPort">
      Start with this port
    </v-btn>
  </v-container>
  <v-container v-else class="ma-0 pa-0" fluid>
    <v-card outlined color="transparent">
      <v-row>
        <v-col cols="8">
          <v-container fluid @keydown.46="onClear()">
            <v-textarea
              id="id_textarea"
              v-model="consoleText"
              readonly
              solo
              :rows="nbRows"
            ></v-textarea>
            <v-text-field
              v-model="input"
              label="Send AT Command"
              hide-details="auto"
              @keyup.enter="onInput()"
            ></v-text-field>
          </v-container>
        </v-col>
        <v-col cols="4">
          <v-container v-if="saveText" fluid>
            <v-btn
              elevation="2"
              color="error"
              x-large
              block
              @click="stopFileSaving"
            >
              Stop file saving
            </v-btn>
          </v-container>
          <v-container v-else fluid>
            <v-btn
              elevation="2"
              color="primary"
              x-large
              block
              @click="startFileSaving"
            >
              Start file saving
            </v-btn>
          </v-container>
          <!-- <v-container fluid>
            <v-btn elevation="2" color="normal" x-large block>
              Set File Commands
            </v-btn>
          </v-container> -->
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

interface Idata {
  innerHeight: number
  innerWidth: number
  nbRows: number
  isStart: boolean
  input: string
  serial: any
  port: any
  reader: any
  writer: any
  baudrate: number
  baudrates: Array<number>
}

export default Vue.extend({
  name: 'FirstPage',

  data: (): Idata => ({
    innerHeight: 1080,
    innerWidth: 720,
    nbRows: 20,
    isStart: false,
    input: '',
    serial: null,
    port: null,
    reader: null,
    writer: null,
    baudrate: 9600,
    baudrates: [9600, 115200, 500000],
  }),

  computed: {
    ...mapGetters({
      consoleText: 'getConsoleText',
      saveText: 'isSaveText',
    }),
  },

  destroyed() {},

  created() {},

  mounted() {
    // @ts-ignore
    this.serial = navigator.serial

    //
    this.reportWindowSize()
    window.onresize = this.reportWindowSize
  },

  methods: {
    reportWindowSize() {
      this.innerHeight = window.innerHeight
      this.innerWidth = window.innerWidth
      const temp = Math.floor(this.innerHeight / 100)
      this.nbRows = 3 * temp - 4
    },
    onClear() {
      this.$store.commit('clearConsoleText')
    },

    stopFileSaving() {
      this.$store.commit('setSaveText', false)
    },

    startFileSaving() {
      this.$store.commit('setSaveText', true)
    },

    async onInput() {
      await this.writer.write(this.input + '\r\n')
      this.$store.commit('addConsoleText', this.input)

      // Allow the serial port to be closed later.
      // this.writer.releaseLock()
    },

    async initPort() {
      this.port = await this.serial.requestPort()

      // this.serial.addEventListener('connect', alert)
      this.port.addEventListener('disconnect', alert)
    },

    async startPort() {
      this.isStart = true

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

      // Stream Rx
      const textDecoder = new TextDecoderStream()
      this.port.readable.pipeTo(textDecoder.writable)
      const reader = textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader()

      // Stream Tx
      const textEncoder = new TextEncoderStream()
      textEncoder.readable.pipeTo(this.port.writable)
      this.writer = textEncoder.writable.getWriter()

      // Listen to data coming from the serial device.
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock()
          break
        }
        this.$store.commit('addConsoleText', value)
      }
    },
  },
})
</script>
