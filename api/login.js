import { request } from '@/lib/request'

export function getCode(params) {
   return  request.post('/api/user/send-verify-code', params)
}
export function login(params) {
   return  request.post('/api/user/login', params)
}
 
 export function logout() {
      return  request.post('/api/user/logout')
 }
 
 export function getInfo(token) {
      return  request.get('/api/v2/user/userinfo')
 }