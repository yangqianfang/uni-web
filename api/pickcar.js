import {
	request
} from '@/lib/request' 
 
// 获取订单
export function getOrdrData(params) {
	return request.post('/api/order/get-v2', params)
}	

// 运维人员信息
/* 
 order_id	否	int	订单id
 location	是	string	用户位置 114.29695000052,30.517766741086
 */
export function getOpsInfo(params) {
	return request.post('/api/v2/plan/plan-status', params)
}

