import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import coupons from '@/pages/coupons/module'
import authentication from '@/pages/authentication/module'
import valuation from '@/pages/valuation/module'
import order from '@/pages/order/module'
import photograph from '@/pages/photograph/module'
import settlement from '@/pages/settlement/module'
import createPersistedState from "vuex-persistedstate";
Vue.use( Vuex )
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store( {
	modules: {
		user,
		coupons,
		authentication,
		valuation,
		order,
		photograph,
		settlement
	},
	strict: debug,
	plugins: [ createPersistedState( {
		storage: window.sessionStorage
	} ) ]
} )
