import Time from '../modules/time'

interface Istate {
  consoleTab: Array<string>
  consoleText: string
  isSaveTxt: boolean
  writableStream: any
}

export const state = (): Istate => ({
  consoleTab: [],
  consoleText: '',
  isSaveTxt: false,
  writableStream: null,
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

  async setSaveText(state: Istate, value: boolean) {
    state.isSaveTxt = value
    if (state.isSaveTxt === true) {
      // create a new handle
      // @ts-ignore
      const newHandle = await window.showSaveFilePicker()

      // create a FileSystemWritableFileStream to write to
      state.writableStream = await newHandle.createWritable()

      // close the file and write the contents to disk.
      window.onbeforeunload = () => {
        state.writableStream.close()
        state.isSaveTxt = false
      }
    } else {
      // close the file and write the contents to disk.
      await state.writableStream.close()
      window.onbeforeunload = () => {}
    }
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

      if (state.isSaveTxt === true) {
        const blob = new Blob([localText], {
          type: 'application/txt',
        })
        state.writableStream.write(blob)
      }

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
