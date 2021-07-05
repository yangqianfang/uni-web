import { request } from '@/lib/request'
const module = {
    namespaced: true,
    state: {
        list: [],
        
    },
    mutations: {
        setList(state, data) {
            state.list = data
        }
    },
    actions: {
        async getList({ commit }, params) {
            const res = await request.get('/api/v2/user/coupons', params)
            commit('setList',res)
        },

        async exchangeCode({ commit }, params) {
            try{
                const res = await request.post('/api/v2/user/exchange-code', params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        } 

    }
}

export default module
