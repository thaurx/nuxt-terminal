import Time from '../modules/time'

interface Istate {
  consoleTab: Array<any>
  isTimeText: boolean
  isSaveTxt: boolean
  colorTxt: string
  writableStream: any
}

export const state = (): Istate => ({
  consoleTab: [],
  isTimeText: false,
  isSaveTxt: false,
  colorTxt: '',
  writableStream: null,
})

export const getters = {
  isSaveText: (state: Istate) => {
    return state.isSaveTxt
  },
  isTimeText: (state: Istate) => {
    return state.isTimeText
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

  setTimeText(state: Istate, value: boolean) {
    state.isTimeText = value
  },

  addConsoleText(state: Istate, line: string) {
    if (line.length > 0) {
      let localText = ''
      localText += line
      if (state.consoleTab.length === 1000) {
        state.consoleTab.shift()
      }

      // Get Color
      console.log(localText)
      const re = /e\[\d{1,2}m/gm
      const colorTab = localText.match(re)
      let localTextOnly = ''
      if (colorTab && colorTab.length > 0) {
        localTextOnly = localText.split(re)[1]
      } else {
        localTextOnly = localText
      }

      // Set Color Before
      if (colorTab && colorTab.length > 0) {
        switch (colorTab[0].split('[')[1]) {
          case '90m': // # Black
            state.colorTxt = 'black--text'
            break
          case '91m': // # Red
            state.colorTxt = 'red--text'
            break
          case '92m': // # Green
            state.colorTxt = 'green--text'
            break
          case '93m': // # Yellow
            state.colorTxt = 'yellow--text'
            break
          case '94m': // # Blue
            state.colorTxt = 'blue--text'
            break
          case '95m': // # Purple
            state.colorTxt = 'purple--text'
            break
          case '96m': // # Cyan
            state.colorTxt = 'cyan--text'
            break
          case '97m': // # White
            state.colorTxt = 'white--text'
            break
          case '0m': // # No
            state.colorTxt = ''
            break
          default:
            state.colorTxt = ''
            break
        }
      }

      // Add Time
      let localTextAndTime = ''
      if (state.isTimeText) {
        localTextAndTime += '[' + Time.getInstant() + ']   '
      }
      localTextAndTime += localTextOnly.toUpperCase()

      // Save Txt
      state.consoleTab.push({ value: localTextAndTime, color: state.colorTxt })

      // Set Color After
      if (colorTab && colorTab.length > 1) {
        switch (colorTab[1].split('[')[1]) {
          case '90m': // # Black
            state.colorTxt = 'black--text'
            break
          case '91m': // # Red
            state.colorTxt = 'red--text'
            break
          case '92m': // # Green
            state.colorTxt = 'green--text'
            break
          case '93m': // # Yellow
            state.colorTxt = 'yellow--text'
            break
          case '94m': // # Blue
            state.colorTxt = 'blue--text'
            break
          case '95m': // # Purple
            state.colorTxt = 'purple--text'
            break
          case '96m': // # Cyan
            state.colorTxt = 'cyan--text'
            break
          case '97m': // # White
            state.colorTxt = 'white--text'
            break
          case '0m': // # No
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
