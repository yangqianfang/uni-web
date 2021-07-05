import { getCarOilDetail, getLongPrice, createOrder } from '@/api/order'
import { getOrdrData } from '@/api/pickcar'
import { getSafeList } from '@/api/index'
import { getorderv2 } from '@/api/order'

const module = {
    namespaced: true,
    state: {
        oilDetail: null,
        longPrice: null,
        safeList: null
    },
    mutations: {
        setOilDetail(state, data){
            state.oilDetail = data
        },
        setLongPrice(state, data){
            state.longPrice = data
        },
        setSafeList(state, data){
            state.safeList = data[0]
        }
    },
    actions: {
        async getCarOilDetail({ commit }, params) {
            try{
                const res = await getCarOilDetail(params)
                commit('setOilDetail',res)
            }catch(err){
                return Promise.reject(err);
            }
        },
        async getLongPrice({ commit }, params) {
            try{
                const res = await getLongPrice(params)
                commit('setLongPrice',res)
            }catch(err){
                return Promise.reject(err);
            }
        },
        async createOrder({ commit }, params) {
            try{
                const res = await createOrder(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
        async getOrdrData({ commit }, params){
            try{
                const res = await getOrdrData(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
        async getOrderV2({ commit }, params){
            try{
                const res = await getorderv2(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
        async getSafeList({ commit }, params){
            try{
                const res = await getSafeList(params)
                commit('setSafeList',res)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        }

    }
}

export default module
