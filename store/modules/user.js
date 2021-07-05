import {
	login,
	logout,
	getInfo
} from '@/api/login'
import { information } from '@/api/index'
import { localStorageKey } from '@/lib/base';
const user = {
	namespaced: true,
	state: {
		user: '',
		name: "",
		status: '',
		token: "",
		csrf_token: "",
		information:""
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token;
		},
		SET_STATUS: (state, status) => {
			state.status = status;
		},
		SET_USER: (state, user) => { 
			state.user = user;
		},
		SET_CSRFTOKEN: (state, csrf_token) => {
			state.csrf_token = csrf_token;
		},
		SET_INFORMATION: (state, information) => {
			state.information = information;
		},
		
	},

	actions: {
		 
		Login({
			commit
		}, loginForm) {
			commit('SET_TOKEN', '');
			return new Promise((resolve, reject) => {
				login(loginForm).then(res => {
					commit('SET_TOKEN', res.access_token);
					commit('SET_USER', res.user);
					commit('SET_CSRFTOKEN', res.csrf_token);
					uni.setStorage({
						key: 'access_token',
						data: res.access_token,
					})
					uni.setStorage({
						key: localStorageKey.FENGNIAO_USER,
						data: res.user,
					})
					resolve(res);
				}, res => {
					reject(res);
				}).catch(error => {
					reject(error)
				});
			});
		},

		// 获取用户信息
		async getInfo({
			commit,
			state
		}) {
			try{
				const res = await getInfo()
				uni.setStorage({
					key: localStorageKey.FENGNIAO_USER,
					data: res,
				})
				commit('SET_USER', res)
				return res
			}catch(err){
				return Promise.reject(err)
			}
		},
		/* 其他配置信息 */
		async getInformation({
			commit,
			state
		},parms) {
			try{
				const res = await information(parms) 
				commit('SET_INFORMATION', res) 
			}catch(err){
				return Promise.reject(err)
			}
		},

		//退出
		async logout({commit}, state) {
			try{
				await logout()
			}catch(err){
				return Promise.reject(err)
			}
		}
	}
};

export default user;
