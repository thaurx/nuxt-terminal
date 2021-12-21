import Time from '../modules/time'

interface Istate {
  consoleTime: boolean
  consoleText: string
}

export const state = (): Istate => ({
  consoleTime: true,
  consoleText: '',
})

export const getters = {
  getConsoleText: (state: Istate) => {
    return state.consoleText
  },
}

export const mutations = {
  clearConsoleText(state: Istate) {
    state.consoleText = ''
  },

  setConsoleTime(state: Istate, textTime: boolean) {
    state.consoleTime = textTime
  },

  addConsoleText(state: Istate, line: string) {
    if (line.length > 0) {
      if (state.consoleTime === true) {
        state.consoleText += '[' + Time.getTime() + ']  '
      }
      state.consoleText += line
      state.consoleText += '\r\n'
    }
  },
}
