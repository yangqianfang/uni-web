import { request } from '@/lib/request'

// 支付（微信和余额）
export async function prepay(params) {
	return await request.post('/api/pay/weixin-prepay', params)
}
// 支付宝支付
export async function alipay(params) {
	return await request.post('/api/pay/alipay-prepay', params)
}
// 违约金支付（微信和余额）
export async function recordpay(params) {
	return await request.post('/api/pay/weixin-pay-record', params)
}
// 违约金支付宝
export async function recordalipay(params) {
	return await request.post('/api/pay/alipay-pay-record', params)
}

