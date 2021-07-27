import * as types from "./mutation-types"

// state
export const state = () => ({
    bgColour: null
})

// getters
export const getters = {
  bg: state => state.bgColour
}

// mutations
export const mutations = {
  [types.GET_BG_COLOUR](state, { bg }) {
    state.bgColour = bg
  }
}

// actions
export const actions = {
  setColour({ commit },payload) {
    commit(types.GET_BG_COLOUR, { bg: payload })
  }
}