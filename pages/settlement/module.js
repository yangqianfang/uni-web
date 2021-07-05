import { getFinishAmount, getPayRecord } from '@/api/order'
import { getWxConfig } from '@/api/base'
const module = {
    namespaced: true,
    state: {
        info: null,
        wxconfig: null
    },
    mutations: {
        setList(state, data) {
            state.info = data
        },
        setWxConfig(state, data) {
            state.wxconfig = data
        }
    },
    actions: {
        async getFinishAmount({ commit }, params) {
            try{
                const res = await getFinishAmount(params)
                commit('setList', res)
            }catch(err){
                return Promise.reject(err)
            }
        },
        async getPayRecord({ commit }, params) {
            try{
                const res = await getPayRecord(params)
                commit('setList', res)
            }catch(err){
                return Promise.reject(err)
            }
        },
        async getWxConfig({ commit }, params){
            try{
                const res = await getWxConfig(params)
                commit('setWxConfig', res)
            }catch(err){
                return Promise.reject(err)
            }
        }
    }
}

export default module

