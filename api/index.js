import {
	request
} from '@/lib/request'

export function getCity(params) {
	return request.post('/api/v2/app/city', params)
}

export function getCityinfo(params) {
	return request.get('/api/v2/app/cityinfo', params)
}

export function information(params) {
	return request.get('/api/v2/app/information', params)
}
/* 获取坐标附近汽车列表 */
export function getCarlist(params) {
	return request.post('/api/v2/car/use-list', params)
}
export function carPriceDetail(params) {
	return request.post('/api/v2/car/car-price-detail', params)
} 
/* 获取附近 网点、 送车点、车辆信息
 参数:
 city 西双版纳傣族自治州
 location位置location = lng,lat
 type 类型 string 1送车点 2网点 4车辆 6送车点提示信息 可以传 type=1,2,4  type=1,2 type=1,4 等
 k //hack字段 在还车接口中调用传参为k=1
 */
export function getNearbyList(params) {
	return request.post('/api/car/nearby', params)
}

export function getPlanTime(params) {
	return request.post('/api/v2/car/get-plan-time', params)
}
/* 获取保险列表 */
export function getSafeList(params) {
	return request.post('/api/user/get-new-safe-list', params)
}

//  创建自取车订单
export function creatCarOrder(params) {
	return request.post('/api/order/create-v2', params)
}
// 创建送车订单
export function creatPlanOrder(params) {
	return request.post('/api/v2/plan/create', params)
}
 
// 取消订单
export function cancelOrder(params) {
	return request.post('/api/order/cancel-v2', params)
}
// 取消订单
export function getOrdrData(params) {
	return request.post('/api/order/get-v2', params)
}

