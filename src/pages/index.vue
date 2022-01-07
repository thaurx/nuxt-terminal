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
            <v-card id="id_textarea" class="overflow-y-auto" :height="nbRows">
              <v-card-text>
                <div v-for="(n, i) in consoleTab" :key="i" :class="n.color">
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
          <v-container v-if="timeText" fluid>
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
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Vue from 'vue'

import fileDownload from 'js-file-download'

interface Idata {
  innerHeight: number
  innerWidth: number
  nbRows: number
  isStart: boolean
  isFile: boolean
  file: Array<any>
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
    isFile: false,
    file: [],
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
      consoleTab: 'getConsoleTab',
      saveText: 'isSaveText',
      timeText: 'isTimeText',
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
      const temp = Math.floor(this.innerHeight / 3)
      this.nbRows = temp * 2

      const textarea = document.getElementById('id_textarea')
      if (textarea !== null) {
        textarea.scrollTop = textarea.scrollHeight
      }
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

    stopTimeText() {
      this.$store.commit('setTimeText', false)
    },

    startTimeText() {
      this.$store.commit('setTimeText', true)
    },

    getFileExemple() {
      const myConfig = {
        'button-1': {
          name: 'AT',
          cmd: ['AT\r\n', '/!delay:100', 'ATI13\r\n', '/!delay:1000'],
          times: 2,
        },
      }
      fileDownload(JSON.stringify(myConfig), 'config.json')
    },

    setFileCommands(file: File) {
      const reader = new FileReader()
      reader.onload = (evt: any) => {
        const temp = JSON.parse(evt.target.result)
        const keys = Object.keys(temp)
        const values = Object.values(temp)
        for (let i = 0; i < keys.length; i++) {
          this.file.push({ key: keys[i], value: values[i] })
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
            await this.writer.write(tempCmd[j] + '\r\n')
          }
        }
      }
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
