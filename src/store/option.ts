import Time from '../modules/time'

interface Istate {
  optionAddTime: boolean
  optionCommands: boolean
  optionDuoMode: boolean
  optionFileTxt: boolean
  optionUartColor: boolean

  consoleTab1: Array<any>
  consoleTab2: Array<any>
  colorTxt1: string
  colorTxt2: string

  writableStream: any

  file: Array<any>

  items: Array<any>
}

export const state = (): Istate => ({
  optionAddTime: false,
  optionCommands: false,
  optionDuoMode: false,
  optionFileTxt: false,
  optionUartColor: false,

  consoleTab1: [],
  consoleTab2: [],
  colorTxt1: '',
  colorTxt2: '',

  writableStream: null,

  file: [],

  items: [
    {
      title: 'Add time',
      switch: false,
      icon: 'mdi-view-dashboard',
      iconOn: 'mdi-square-rounded',
      iconOff: 'mdi-square-rounded-outline',
    },
    {
      title: 'Commands',
      switch: false,
      icon: 'mdi-view-dashboard',
      iconOn: 'mdi-square-rounded',
      iconOff: 'mdi-square-rounded-outline',
    },
    {
      title: 'Dual mode',
      switch: false,
      icon: 'mdi-view-dashboard',
      iconOn: 'mdi-square-rounded',
      iconOff: 'mdi-square-rounded-outline',
    },
    {
      title: 'Save logs',
      switch: false,
      icon: 'mdi-image',
      iconOn: 'mdi-square-rounded',
      iconOff: 'mdi-square-rounded-outline',
    },
    {
      title: 'Uart color',
      switch: false,
      icon: 'mdi-help-box',
      iconOn: 'mdi-square-rounded',
      iconOff: 'mdi-square-rounded-outline',
    },
  ],
})

export const getters = {
  isOptionAddTime: (state: Istate) => {
    return state.optionAddTime
  },
  isOptionCommands: (state: Istate) => {
    return state.optionCommands
  },
  isOptionDuoMode: (state: Istate) => {
    return state.optionDuoMode
  },
  isOptionFileTxt: (state: Istate) => {
    return state.optionFileTxt
  },
  isOptionUartColor: (state: Istate) => {
    return state.optionUartColor
  },
  getItems: (state: Istate) => {
    return state.items
  },
  getConsoleTab1: (state: Istate) => {
    return state.consoleTab1
  },
  getConsoleTab2: (state: Istate) => {
    return state.consoleTab2
  },
}

export const mutations = {
  clearConsoleText1(state: Istate) {
    state.consoleTab1 = []
  },
  clearConsoleText2(state: Istate) {
    state.consoleTab2 = []
  },
  setItems(state: Istate, value: any) {
    state.items = value
  },
  setOptionAddTime(state: Istate, value: boolean) {
    state.optionAddTime = value
    state.items[0].switch = value
  },
  setOptionCommands(state: Istate, value: boolean) {
    state.optionCommands = value
    state.items[1].switch = value
  },
  setOptionDuoMode(state: Istate, value: boolean) {
    state.optionDuoMode = value
    state.items[2].switch = value
  },
  setOptionFileTxtStart(state: Istate) {
    state.optionFileTxt = false
    state.items[3].switch = false
  },
  async setOptionFileTxt(state: Istate, value: boolean) {
    if (state.optionFileTxt !== value) {
      state.optionFileTxt = value
      if (value === false) {
        await state.writableStream.close()
        window.onbeforeunload = () => {}
      }
      state.items[3].switch = value
    }
  },
  setOptionUartColor(state: Istate, value: boolean) {
    state.optionUartColor = value
    state.items[4].switch = value
  },
  setWritableStream(state: Istate, value: boolean) {
    state.writableStream = value
  },

  addConsoleText1(state: Istate, line: string) {
    if (line.length > 0) {
      let localText = ''
      localText += line
      if (state.consoleTab1.length === 1000) {
        state.consoleTab1.shift()
      }

      // Get Color
      let localTextOnly = ''
      localTextOnly = localText

      // Add Time
      let localTextAndTime = ''
      if (state.optionAddTime) {
        localTextAndTime += '[' + Time.getInstant() + ']   '
      }
      localTextAndTime += localTextOnly.toUpperCase()

      // Save Txt
      state.consoleTab1.push({
        value: localTextAndTime,
        color: state.colorTxt1,
      })

      if (state.optionFileTxt === true) {
        if (state.optionDuoMode) {
          const blob = new Blob(['{1} ' + localTextAndTime + '\r\n'], {
            type: 'application/txt',
          })
          state.writableStream.write(blob)
        } else {
          const blob = new Blob([localTextAndTime + '\r\n'], {
            type: 'application/txt',
          })
          state.writableStream.write(blob)
        }
      }
    }
  },

  addConsoleText2(state: Istate, line: string) {
    if (line.length > 0) {
      let localText = ''
      localText += line
      if (state.consoleTab2.length === 1000) {
        state.consoleTab2.shift()
      }

      // Get Color
      // console.log(localText)
      let localTextOnly = ''
      localTextOnly = localText

      // Add Time
      let localTextAndTime = ''
      if (state.optionAddTime) {
        localTextAndTime += '[' + Time.getInstant() + ']   '
      }
      localTextAndTime += localTextOnly.toUpperCase()

      // Save Txt
      state.consoleTab2.push({
        value: localTextAndTime,
        color: state.colorTxt2,
      })

      if (state.optionFileTxt === true) {
        const blob = new Blob(['{2} ' + localTextAndTime + '\r\n'], {
          type: 'application/txt',
        })
        state.writableStream.write(blob)
      }
    }
  },
}
