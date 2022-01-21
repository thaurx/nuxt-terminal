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
  setOptionAddTime(state: Istate, value: boolean) {
    state.optionAddTime = value
  },
  setOptionCommands(state: Istate, value: boolean) {
    state.optionCommands = value
  },
  setOptionDuoMode(state: Istate, value: boolean) {
    state.optionDuoMode = value
  },
  async setOptionFileTxt(state: Istate, value: boolean) {
    state.optionFileTxt = value
    if (value === false) {
      await state.writableStream.close()
      window.onbeforeunload = () => {}
    }
  },
  setOptionUartColor(state: Istate, value: boolean) {
    state.optionUartColor = value
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
