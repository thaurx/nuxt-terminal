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

interface Istate {
  serial: any

  serialPort1: any
  serialPort2: any
  serialPorts: Array<any>

  serialBaudate1: number
  serialBaudate2: number

  serialOpen1: boolean
  serialOpen2: boolean

  serialReaderStop1: any
  serialReader1: any

  serialWriterStop1: any
  serialWriter1: any

  serialReaderStop2: any
  serialReader2: any

  serialWriterStop2: any
  serialWriter2: any
}

export const state = (): Istate => ({
  serial: null,

  serialPort1: null,
  serialPort2: null,
  serialPorts: [],

  serialBaudate1: 9600,
  serialBaudate2: 9600,

  serialOpen1: false,
  serialOpen2: false,

  serialReaderStop1: null,
  serialReader1: null,

  serialWriterStop1: null,
  serialWriter1: null,

  serialReaderStop2: null,
  serialReader2: null,

  serialWriterStop2: null,
  serialWriter2: null,
})

export const getters = {
  getSerial: (state: Istate) => {
    return state.serial
  },

  getSerialPort1: (state: Istate) => {
    return state.serialPort1
  },
  getSerialPort2: (state: Istate) => {
    return state.serialPort2
  },
  getSerialPorts: (state: Istate) => {
    return state.serialPorts
  },

  getSerialBaudate1: (state: Istate) => {
    return state.serialBaudate1
  },
  getSerialBaudate2: (state: Istate) => {
    return state.serialBaudate2
  },

  isSerialOpen1: (state: Istate) => {
    return state.serialOpen1
  },
  isSerialOpen2: (state: Istate) => {
    return state.serialOpen2
  },
}

export const mutations = {
  setSerial(state: Istate, input: any) {
    state.serial = input
  },

  setSerialPort1(state: Istate, input: any) {
    state.serialPort1 = input
  },
  setSerialPort2(state: Istate, input: any) {
    state.serialPort2 = input
  },
  setSerialPorts(state: Istate, input: Array<any>) {
    state.serialPorts = input
  },

  setSerialBaudate1(state: Istate, input: any) {
    state.serialBaudate1 = input
  },
  setSerialBaudate2(state: Istate, input: any) {
    state.serialBaudate2 = input
  },

  setSerialOpen1(state: Istate, input: any) {
    state.serialOpen1 = input
  },
  setSerialOpen2(state: Istate, input: any) {
    state.serialOpen2 = input
  },

  setSerialStream1(state: Istate) {
    const textDecoder = new TextDecoderStream()
    state.serialReaderStop1 = state.serialPort1.readable.pipeTo(
      textDecoder.writable
    )
    state.serialReader1 = textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader()

    const textEncoder = new TextEncoderStream()
    state.serialWriterStop1 = textEncoder.readable.pipeTo(
      state.serialPort1.writable
    )
    state.serialWriter1 = textEncoder.writable.getWriter()
  },

  setSerialStream2(state: Istate) {
    const textDecoder = new TextDecoderStream()
    state.serialReaderStop2 = state.serialPort2.readable.pipeTo(
      textDecoder.writable
    )
    state.serialReader2 = textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader()

    const textEncoder = new TextEncoderStream()
    state.serialWriterStop2 = textEncoder.readable.pipeTo(
      state.serialPort2.writable
    )
    state.serialWriter2 = textEncoder.writable.getWriter()
  },
}

export const actions = {
  initSerial({ commit }: any) {
    function addPorts(serial: any) {
      serial.getPorts().then((ports: any) => {
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
        commit('setSerialPorts', myPortsWithName)
      })
    }

    // @ts-ignore
    const serial = navigator.serial
    serial.addEventListener('connect', () => {
      addPorts(serial)
    })
    serial.addEventListener('disconnect', () => {
      addPorts(serial)
    })
    addPorts(serial)
    commit('setSerial', serial)
  },

  requestSerial1({ commit, state }: any) {
    state.serial
      .requestPort()
      .then((port: any) => {
        commit('setSerialPort1', port)
      })

      // The user didn't select a port.
      .catch((e: any) => {
        alert(e)
      })
  },
  requestSerial2({ commit, state }: any) {
    state.serial
      .requestPort()
      .then((port: any) => {
        commit('setSerialPort2', port)
      })

      // The user didn't select a port.
      .catch((e: any) => {
        alert(e)
      })
  },

  async closeSerialPort1({ commit, state }: any) {
    try {
      await state.serialReader1.cancel()
      await state.serialReaderStop1.catch(() => {
        /* Ignore the error */
      })

      await state.serialWriter1.close()
      await state.serialWriterStop1

      await state.serialPort1.close()
    } catch (e) {
      alert('err: closeSerialPort')
    }
    commit('setSerialOpen1', false)
  },
  async closeSerialPort2({ commit, state }: any) {
    try {
      await state.serialReader2.cancel()
      await state.serialReaderStop2.catch(() => {
        /* Ignore the error */
      })

      await state.serialWriter2.close()
      await state.serialWriterStop2

      await state.serialPort2.close()
    } catch (e) {
      alert('err: closeSerialPort')
    }
    commit('setSerialOpen2', false)
  },

  async openSerialPort1({ commit, state }: any) {
    await state.serialPort1.open({ baudRate: state.serialBaudate1 })
    commit('setSerialOpen1', true)

    // Stream Rx / Tx
    commit('setSerialStream1')

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await state.serialReader1.read()
      if (done) {
        // Allow the serial port to be closed later.
        state.serialReader1.releaseLock()
        break
      }

      // Add Text
      commit('option/addConsoleText' + '1', value, { root: true })
      const textarea = document.getElementById('id_textarea' + '1')
      if (textarea !== null) {
        textarea.scrollTop = textarea.scrollHeight
      }
    }
  },
  async openSerialPort2({ commit, state }: any) {
    await state.serialPort2.open({ baudRate: state.serialBaudate2 })
    commit('setSerialOpen2', true)

    // Stream Rx / Tx
    commit('setSerialStream2')

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await state.serialReader2.read()
      if (done) {
        // Allow the serial port to be closed later.
        state.serialReader2.releaseLock()
        break
      }

      // Add Text
      commit('option/addConsoleText' + '2', value, { root: true })
      const textarea = document.getElementById('id_textarea' + '2')
      if (textarea !== null) {
        textarea.scrollTop = textarea.scrollHeight
      }
    }
  },

  async writeLine1({ commit, state }: any, input: any) {
    await state.serialWriter1.write(input + '\r\n')

    // Add Text
    commit('option/addConsoleText' + '1', input, { root: true })
    const textarea = document.getElementById('id_textarea' + '1')
    if (textarea !== null) {
      textarea.scrollTop = textarea.scrollHeight
    }
  },
  async writeLine2({ commit, state }: any, input: any) {
    await state.serialWriter2.write(input + '\r\n')

    // Add Text
    commit('option/addConsoleText' + '2', input, { root: true })
    const textarea = document.getElementById('id_textarea' + '2')
    if (textarea !== null) {
      textarea.scrollTop = textarea.scrollHeight
    }
  },
}
