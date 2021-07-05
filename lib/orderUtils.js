import Vue from 'vue'
import {creatCarOrder,creatPlanOrder} from '@/api/index';
import { localStorageKey } from '@/lib/base';
/**
 * @author yangqianfang
 * @time 2019-11-11
 * @description 订单创建公共
 * type 0 :自取订单,1:订单送车
 * 
 */ 
async function orderSubmit(subData, type = "0"){
	let res
	if(type === "0"){
		try{
			res = await creatCarOrder(subData)
			/* uni.setStorage({
				key: localStorageKey.PICK_CAR_INFO,
				data: res.data
			}); */
			return res
		}catch(err){
			Vue.prototype.$toast.info(err.message)
			return Promise.reject(err)
		}
	}
   	if(type === "1"){
		try{
			res = await creatPlanOrder(subData)
			/* uni.setStorage({
				key: localStorageKey.PICK_CAR_INFO,
				data: res.data
			}) */
			return res
		}catch(err){
			Vue.prototype.$toast.info(err.message)
			return Promise.reject(err)
		}
   	}
}
  
export { orderSubmit }