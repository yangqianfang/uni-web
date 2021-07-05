import { request } from '@/lib/request'
const module = {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        async commitIdcard({ commit }, params) {
            try{
                const res = await request.post('/api/user/commit-idcard', params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
        async commitDriver({ commit }, params) {
            try{
                const res = await request.post('/api/user/commit-driver', params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
        async getFaceIdToken({ commit }, params) {
            try{
                const res = await request.post('/api/user/get-face-id-token', params)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        }

    }
}

export default module
