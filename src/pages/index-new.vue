<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-card outlined color="transparent">
      <v-card-title>
        <v-row>
          <v-col cols="3">
            <div class="headline mb-1">Console</div>
          </v-col>
          <v-col cols="6">
            <v-btn @click="onClick">test</v-btn>
          </v-col>
          <v-col cols="3"> </v-col>
        </v-row>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

interface Idata {
  writableStream: any
}

export default Vue.extend({
  name: 'FirstPage',

  data: (): Idata => ({
    writableStream: null,
  }),

  computed: {},

  async destroyed() {
    // await this.writableStream.close()
  },

  created() {},

  beforeDestroy() {},

  mounted() {},

  methods: {
    async onClick() {
      // store a reference to our file handle
      // let fileHandle

      // async function getFile() {
      //   // open file picker
      //   // @ts-ignore
      //   ;[fileHandle] = await window.showOpenFilePicker()

      //   if (fileHandle.kind === 'file') {
      //     // run file code
      //   } else if (fileHandle.kind === 'directory') {
      //     // run directory code
      //   }
      // }
      // getFile()

      const blob = new Blob(['test \r\n'], {
        type: 'application/txt',
      })

      // create a new handle
      // @ts-ignore
      const newHandle = await window.showSaveFilePicker()

      // create a FileSystemWritableFileStream to write to
      this.writableStream = await newHandle.createWritable()

      // write our file
      await this.writableStream.write(blob)
      await this.writableStream.write(blob)
      setInterval(() => {
        this.writableStream.write(blob)
      }, 1000)

      // setTimeout(() => {
      //   this.writableStream.close()
      // }, 10000)

      // close the file and write the contents to disk.
      // this.writableStream.close()

      window.onbeforeunload = () => {
        this.writableStream.close()
      }
    },
  },
})
</script>
