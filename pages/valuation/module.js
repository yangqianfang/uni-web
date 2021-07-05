import { request } from '@/lib/request'
const module = {
    namespaced: true,
    state: {
        info: null,
        budget: null,
        modeData: []
    },
    mutations: {
        setInfo(state, data) {
            state.info = data
        },
        setCity(state, data) {
            let citys = data.city_cate_mode_data
            let pickerDistrict = []
            citys.forEach(item => {
                let itemLevel1 = {}
                let itemLevel2 = {}
                itemLevel1.value = item.city
                itemLevel1.label = item.city
                itemLevel1.children = []
                let data = item.cate_list || []
                data.forEach(item => {
                    itemLevel2.value = item.cate_name
                    itemLevel2.label = item.cate_name
                    itemLevel2.children = []
                    let data2 = item.mode_list || []
                    let itemLevel3 ={}
                    itemLevel3.children = []
                    data2.forEach(item => {
                        itemLevel3.value = item
                        itemLevel3.label = item
                        itemLevel2.children.push(itemLevel3)
                        itemLevel3 = {}
                    })
                    itemLevel1.children.push(itemLevel2)
                    itemLevel2 = {}
                })
                pickerDistrict.push(itemLevel1)
            })
            state.modeData = pickerDistrict
            // console.log(citys)
            // state.modeData = citys
        },
        setBudget(state, data) {
            state.budget = data
        }
    },
    actions: {
        async getInfo({ commit }, params) {
            try{
                const res = await request.post('/api/v2/car/car-price-detail', params)
                commit('setInfo', res)
                commit('setCity', res)
                return res
            }catch(err){
                return Promise.reject(err);
            }
        },
        async getBudget({ commit }, params) {
            try{
                const res = await request.post('/api/v2/car/amount-budget', params)
                commit('setBudget',res)
                // return res
            }catch(err){
                return Promise.reject(err);
            }
        }
    }
}

export default module
