import Time from '../modules/time'

interface Istate {
  consoleTab: Array<any>
  isSaveTxt: boolean
  colorTxt: string
  writableStream: any
}

export const state = (): Istate => ({
  consoleTab: [],
  isSaveTxt: false,
  colorTxt: '',
  writableStream: null,
})

export const getters = {
  isSaveText: (state: Istate) => {
    return state.isSaveTxt
  },
  getConsoleTab: (state: Istate) => {
    return state.consoleTab
  },
}

export const mutations = {
  clearConsoleText(state: Istate) {
    state.consoleTab = []
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
      let localText = ''
      localText += line.toUpperCase()
      if (state.consoleTab.length === 1000) {
        state.consoleTab.shift()
      }

      // Get Color
      const re = /\\E\[[0-9]*M/gm
      const colorTab = localText.match(re)
      let localTextOnly = ''
      if (colorTab && colorTab.length > 1) {
        localTextOnly = localText.split(re)[1]
      } else {
        localTextOnly = localText
      }

      // Set Color Before
      if (colorTab && colorTab.length > 0) {
        console.log(colorTab[0].split('[')[1])
        switch (colorTab[0].split('[')[1]) {
          case '90M': // # Black
            state.colorTxt = 'black--text'
            break
          case '91M': // # Red
            state.colorTxt = 'red--text'
            break
          case '92M': // # Green
            state.colorTxt = 'green--text'
            break
          case '93M': // # Yellow
            state.colorTxt = 'yellow--text'
            break
          case '94M': // # Blue
            state.colorTxt = 'blue--text'
            break
          case '95M': // # Purple
            state.colorTxt = 'purple--text'
            break
          case '96M': // # Cyan
            state.colorTxt = 'cyan--text'
            break
          case '97M': // # White
            state.colorTxt = 'white--text'
            break
          case '0M': // # No
            state.colorTxt = ''
            break
          default:
            state.colorTxt = ''
            break
        }
      }

      // Add Time
      const localTextAndTime = '[' + Time.getInstant() + ']   ' + localTextOnly

      // Save Txt
      state.consoleTab.push({ value: localTextAndTime, color: state.colorTxt })

      // Set Color After
      if (colorTab && colorTab.length > 0) {
        switch (colorTab[1].split('[')[1]) {
          case '90M': // # Black
            state.colorTxt = 'black--text'
            break
          case '91M': // # Red
            state.colorTxt = 'red--text'
            break
          case '92M': // # Green
            state.colorTxt = 'green--text'
            break
          case '93M': // # Yellow
            state.colorTxt = 'yellow--text'
            break
          case '94M': // # Blue
            state.colorTxt = 'blue--text'
            break
          case '95M': // # Purple
            state.colorTxt = 'purple--text'
            break
          case '96M': // # Cyan
            state.colorTxt = 'cyan--text'
            break
          case '97M': // # White
            state.colorTxt = 'white--text'
            break
          case '0M': // # No
            state.colorTxt = ''
            break
          default:
            break
        }
      }

      if (state.isSaveTxt === true) {
        const blob = new Blob([localTextAndTime], {
          type: 'application/txt',
        })
        state.writableStream.write(blob)
      }
    }
    const textarea = document.getElementById('id_textarea')
    if (textarea !== null) {
      textarea.scrollTop = textarea.scrollHeight
    }
  },
}
