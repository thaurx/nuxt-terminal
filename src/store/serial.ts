interface Istate {
  serial: any
  serialPort1: any
  serialPort2: any
  serialPorts: Array<any>
  serialNames: Array<string>
}

export const state = (): Istate => ({
  serial: null,
  serialPort1: null,
  serialPort2: null,
  serialPorts: [],
  serialNames: [],
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
  getSerialNames: (state: Istate) => {
    return state.serialNames
  },
}

export const mutations = {
  setSerial(state: Istate, value: any) {
    state.serial = value
  },
  setSerialPort1(state: Istate, value: any) {
    state.serialPort1 = value
  },
  setSerialPort2(state: Istate, value: any) {
    state.serialPort2 = value
  },
  setSerialPorts(state: Istate, value: Array<any>) {
    state.serialPorts = value
  },
  setSerialName(state: Istate, value: Array<any>) {
    state.serialNames = value
  },
}
