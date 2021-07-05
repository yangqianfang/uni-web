import Vue from 'vue'
import { prepay, alipay, recordpay, recordalipay } from '@/api/pay'
/**
 * @author zwcong
 * @time 2019-11-13
 * @description 支付(微信及余额)
 * 
 */ 
async function commonPay(subData){
	try{
        const res = await prepay(subData)
        return res
    }catch(err){
        Vue.prototype.$toast.info(err.message)
        return Promise.reject(err)
    }
}

/**
 * @author zwcong
 * @time 2019-11-13
 * @description 支付宝
 * 
 */ 
async function aliPay(subData){
	try{
        const res = await alipay(subData)
        return res
    }catch(err){
        Vue.prototype.$toast.info(err.message)
        return Promise.reject(err)
    }
}

/**
 * @author zwcong
 * @time 2019-12-03
 * @description 违约金支付（微信和余额）
 * 
 */ 
async function recordPay(subData){
	try{
        const res = await recordpay(subData)
        return res
    }catch(err){
        Vue.prototype.$toast.info(err.message)
        return Promise.reject(err)
    }
}

/**
 * @author zwcong
 * @time 2019-12-03
 * @description 违约金支付宝
 * 
 */ 
async function recordAlipay(subData){
	try{
        const res = await recordalipay(subData)
        return res
    }catch(err){
        Vue.prototype.$toast.info(err.message)
        return Promise.reject(err)
    }
}
  
export { commonPay, aliPay, recordPay, recordAlipay }

