import { getCarOilDetail, getLongPrice, createOrder } from '@/api/order'

const module = {
    namespaced: true,
    state: {
        oilDetail: null,
        longPrice: null
    },
    mutations: {
        setOilDetail(state, data){
            state.oilDetail = data
        },
        setLongPrice(state, data){
            state.longPrice = data
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
        }

    }
}

export default module
