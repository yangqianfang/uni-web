/**
 * @author zwcong
 * @time 2019-10-28
 * @description
 *  uni request 封装,
 *  支持GET，POST，PUT，DELETE
 *
 * @usage
 *  const request = require('./to/path/request')
 *
 *  request.get(url, data)
 *    .then(() => { })
 */
import Vue from 'vue'
import { localStorageKey } from '@/lib/base'
import { getUID, param } from  "@/lib/utils"
import getUniqueKey from  "@/lib/getUniqueKey"

const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
} 
let baseUrl = ''

if(!uni.getStorageSync('DEVICEID')){
    uni.setStorageSync('DEVICEID', 'h5-' + getUniqueKey(true,10,0));
}

let publicParms = {
	ostype: 4,
    uniqueid: getUID(localStorageKey.UID), 
    deviceid: uni.getStorageSync('DEVICEID')
} 

uni.getSystemInfo({
    success: function (res) { 
        publicParms.phone= res.model;
    }
}); 
 let fromatParms = param(publicParms);
const interceptors = []

class Request {
    /**
     * response interceptor
     */
    intercept(res, resolve, reject) {
        return interceptors
            .filter((f) => typeof f === 'function')
            .every((f) => f(res, resolve, reject))
    }

    /**
     * request
     */
    request(option) {
        const header = {
            'content-type': 'application/x-www-form-urlencoded'
        }
        const { url, method, data = {} } = option

        return new Promise((resolve, reject) => {
            try {
				// uni.showLoading({
				//     title: '加载中'
                // });
                Vue.prototype.$loading.show()
                uni.request({
                    url: baseUrl + url + "?" + fromatParms,
                    method: method || METHOD.GET,
                    data,
                    header,
                    success: (res) => this.intercept(res, resolve, reject),
                    // fail: reject
                    fail: (err) => {
						console.log("err",err)
                        if (
                            err &&
                            err.errMsg &&
                            err.errMsg.indexOf('request:fail') !== -1
                        ) {
                            console.error('uniapp request error: ', err)
                        } else {
							console.error(JSON.stringify(err))
                        }
                    },
					complete: ()=>{
                        // uni.hideLoading()
                        Vue.prototype.$loading.hide()
					}
                })
            } catch (err) {
				console.error(err.message)
            }
        })
    }

    get(url, data) {
        return this.request({ url, method: METHOD.GET, data })
    }

    post(url, data) {
        return this.request({ url, method: METHOD.POST, data })
    }

    put(url, data) {
        return this.request({ url, method: METHOD.PUT, data })
    }

    delete(url, data) {
        return this.request({ url, method: METHOD.DELETE, data })
    }

    all(tasks) {
        return Promise.all(tasks)
    }
}

/**
 * 设置base URL
 */
function setBaseUrl(url) {
    baseUrl = url
}

/**
 * 默认response拦截器
 */
function addDefaultInterceptor() {
    interceptors.push((res, resolve, reject) => {
        const status = res.statusCode
        if (status !== 200) {
			if(status === 403){
				uni.removeStorage({
				    key: localStorageKey.FENGNIAO_USER,
				    success: function (res) {
				        uni.redirectTo({
				        	url: '/pages/login/login'
				        })  
				    }
				});
				return;
			}
			if(status === 404){
				Vue.prototype.$toast.info("404")
					return reject("404");
			}
			if(status === 500){
				Vue.prototype.$toast.info("500")
				return reject("500");
			}
            return reject(new Error(`internet error: ${status}`))
        }
        const body = res.data
        if (body.code !== 0) {
			
			return reject(body)
           /* return reject({
                message: body.error,
                body
            }) */
        }
        return resolve(body.data)
    })
}

const request = new Request()

export { setBaseUrl, addDefaultInterceptor, request }
