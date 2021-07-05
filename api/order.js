
import { request } from '@/lib/request'

export async function getCarPriceDetail(params) {
	return await request.post('/api/v2/user/coupons', params) 
}

// 获取车辆油耗和油价
export async function getCarOilDetail(params) {
	return await request.post('/api/v2/car/car-oil-detail', params)
}

// 获取长租日期及价格
export async function getLongPrice(params) {
	return await request.post('/api/order/get-use-long-price', params)
}

// 获取车辆日租价格及价格日历
export async function getDayPrice(params) {
	return await request.post('/api/order/get-use-price', params)
}

// 创建送车订单
export async function createOrder(params) {
	return await request.post('/api/v2/plan/create', params)
}

// 订单上传图片
export async function uploadCarImg(params) {
	return await request.post('/api/order/upload-car-img', params)
}

// 开始订单
export async function orderStart(params) {
	return await request.post('/api/order/start-v2', params)
}
// 开始送车订单
export async function orderStartSend(params) {
	return await request.post('/api/order-record-plan/begin-v2', params)
}


// 结束订单
export async function finishOrder(params) {
	return await request.post('/api/order/finish-order-v2', params)
}


// 晚间还车
export async function freeFinish(params) {
	return await request.post('/api/order/free-finish', params)
}


// 获取待支付订单费用
export async function getFinishAmount(params) {
	return await request.post('/api/order/get-finish-amount-v2', params)
}

// 获取预支付订单费用
export async function getPayRecord(params) {
	return await request.post('/api/v2/order/get-pay-record', params)
}
 
// 取消订单
export async function cancelOrder(params) {
	return await request.post('/api/order/cancel-v2', params)
}

// 检查订单
export async function checkCancel(params) {
	return await request.post('/api/order/check-cancel', params)
}

// 预约订单列表
export async function planOrderList(params) {
	return await request.post('/api/order-record-plan/plan-list-v2', params)
}
// 订单信息
export async function getorderv2(params) {
	return await request.post('/api/order/getorder-v2', params)
}

// 获取订单
export function getOrdrData(params) {
	return request.post('/api/order/get-v2', params)
}