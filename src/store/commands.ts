interface Istate {
  commands: Array<any>
}

export const state = (): Istate => ({
  commands: [
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
    { name: '-', value: '' },
  ],
})

export const getters = {
  getCommands: (state: Istate) => {
    return state.commands
  },
}

export const mutations = {
  clearCommands(state: Istate) {
    state.commands = []
  },
  setCommands(state: Istate, value: any) {
    state.commands.push(value)
  },
  setCommandsPad(state: Istate) {
    for (let i = 0; i < 20; i++) {
      state.commands.push({ name: '-', value: '' })
    }
  },
}
