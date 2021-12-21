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
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"> Console </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions @keydown.46="onClear()">
        <v-row>
          <v-col sm="12">
            <v-container fluid>
              <v-textarea
                id="textarea_id"
                v-model="consoleText"
                rows="20"
                readonly
                solo
              ></v-textarea>
              <v-text-field
                v-model="input"
                label="Send AT Command"
                hide-details="auto"
                @keyup.enter="onInput()"
              ></v-text-field>
            </v-container>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

interface Idata {
  isStart: boolean
  textarea: HTMLElement | null
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
    isStart: false,
    textarea: null,
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
    }),
  },

  destroyed() {},

  mounted() {
    this.textarea = document.getElementById('textarea_id')
    if (this.textarea !== null) {
      this.textarea.scrollTop = this.textarea.scrollHeight
    }

    // @ts-ignore
    this.serial = navigator.serial
  },

  methods: {
    onClear() {
      this.$store.commit('clearConsoleText')
    },

    async onInput() {
      await this.writer.write(this.input + '\r\n')

      // Allow the serial port to be closed later.
      // this.writer.releaseLock()
    },

    async initPort() {
      this.port = await this.serial.requestPort()

      // this.serial.addEventListener('connect', alert)
      this.port.addEventListener('disconnect', alert)

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

      // Streams
      const textDecoder = new TextDecoderStream()
      const textEncoder = new TextEncoderStream()

      // Pipes
      this.port.readable.pipeTo(textDecoder.writable)
      textEncoder.readable.pipeTo(this.port.writable)

      // Transformations
      const reader = textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader()
      this.writer = textEncoder.writable.getWriter()

      // Listen to data coming from the serial device.
      while (this.port.readable) {
        const { value, done } = await reader.read()
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock()
          break
        }
        if (this.textarea !== null) {
          this.$store.commit('addConsoleText', value)
          this.textarea.scrollTop = this.textarea.scrollHeight
        }
      }
    },

    async startPort() {
      this.isStart = true

      await this.port.open({ baudRate: this.baudrate })
    },
  },
})
</script>
