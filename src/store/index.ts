import Time from '../modules/time'

interface Istate {
  consoleTab: Array<string>
  consoleText: string
}

export const state = (): Istate => ({
  consoleTab: [],
  consoleText: '',
})

export const getters = {
  getConsoleText: (state: Istate) => {
    return state.consoleText
  },
}

export const mutations = {
  clearConsoleText(state: Istate) {
    state.consoleTab = []
    state.consoleText = ''
  },

  addConsoleText(state: Istate, line: string) {
    if (line.length > 0) {
      let localText = '[' + Time.getInstant() + ']   '
      localText += line.toUpperCase()
      localText += '\r\n'

      if (state.consoleTab.length === 1000) {
        state.consoleTab.shift()
      }
      state.consoleTab.push(localText)

      state.consoleText = ''
      for (let i = 0; i < state.consoleTab.length; i++) {
        state.consoleText += state.consoleTab[i]
      }
    }
    const textarea = document.getElementById('id_textarea')
    if (textarea !== null) {
      textarea.scrollTop = textarea.scrollHeight
    }
  },
}
