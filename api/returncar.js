import { request } from '@/lib/request'

  
// 附近停车场
export function carPpark(params) {
	return request.post('/api/car/car-park', params)
}
// 获取订单
export function getOrdrData(params) {
	return request.post('/api/order/get-v2', params)
}	
/* 实时获取车辆状态
 URL	/order/carinfo
 方法	POST
 参数	order_id=123 is_plan 是否为预约订单 默认0，0,1 */
export function getCarInfo(params) {
	return request.post('/api/order/carinfo-v2', params)
}

/* 
获取进行中的订单的金额
URL	/order/get-working-amount
方法	POST
参数	order_id=123 
 */
export function getAmount(params) {
	return request.post('/api/order/get-working-amount', params)
}
/*
  车辆控制
  URL	/order/control
  方法	POST
  参数	order_id=4716&car_id=MPD833&location=POINT(111,22)&action=lock (action: lock/unlock/findcar)

  */
 export function carControl(params) {
 	return request.post('/api/order/control', params)
 }
 /* 
 车辆通电
 URL	/order/power-on
 方法	POST
 参数	order_id订单id location位置信息(123,12) car_id 车辆id bluetooth_start是否蓝牙通电 1是 0否*/
 
 export function powerOn(params) {
 	return request.post('/api/order/power-on', params)
 }