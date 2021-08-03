import * as types from "./mutation-types"

// state
export const state = () => ({
    bgColour: null,
    textColour: null
})

// getters
export const getters = {
  bg: state => state.bgColour,
  textColor: state => state.textColour
}

// mutations
export const mutations = {
  [types.GET_BG_COLOUR](state, { bg }) {
    state.bgColour = bg
  },
  [types.GET_TEXT_COLOUR](state, { textColour }) {
    state.textColour = textColour
  }
}

// actions
export const actions = {
  setHeaderColour({ commit },payload) {
    commit(types.GET_BG_COLOUR, { bg: payload.bg })
    commit(types.GET_TEXT_COLOUR, { textColour: payload.text })
  }
}