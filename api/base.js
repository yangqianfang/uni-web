
import { request } from '@/lib/request'

// 微信config
export async function getWxConfig(params) {
	return await request.get('/api/site/get-wechat-api-token', params)
}
