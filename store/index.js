// import Vue from "vue"
// import Vuex from "vuex"
// import state from "./state"
// import getters from "./getters"

// Vue.use(Vuex)

// const requireContext = require.context("./modules", false, /.*\.js$/)

// const modules = requireContext
//   .keys()
//   .map(file => [file.replace(/(^.\/)|(\.js$)/g, ""), requireContext(file)])
//   .reduce((modules, [name, module]) => {
//     if (module.namespaced === undefined) {
//       module.namespaced = true
//     }

//     return { ...modules, [name]: module }
//   }, {})

// const store = new Vuex.Store({
//   state,
// //   getters,
// //   modules
// })

// export default store