import { uploadCarImg, orderStart, finishOrder, orderStartSend, freeFinish} from '@/api/order'

const module = {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        async uploadCarImg({ commit }, params) {
            try{
                const res = await uploadCarImg(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },

        async orderStart({ commit }, params) {
            try{
                const res = await orderStart(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
		async orderStartSend({ commit }, params) {
            try{
                const res = await orderStartSend(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
		async finishOrder({ commit }, params) {
            try{
                const res = await finishOrder(params)
                return res
            }catch(err){ 
                return Promise.reject(err);
            }
        },
        async freeFinish({ commit }, params) {
            try{
                const res = await freeFinish(params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
    }
}

export default module
