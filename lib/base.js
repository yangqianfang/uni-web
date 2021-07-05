const localStorageKey = {
	START_ADDRESS_TEXT : "START_ADDRESS_TEXT",
	END_ADDRESS_TEXT : "END_ADDRESS_TEXT",
	FENGNIAO_USER : "FENGNIAO_USER",
	ORDER_INFO :"ORDER_INFO",
	PICK_CAR_INFO:"PICK_CAR_INFO",
	START_ORDER: "START_ORDER",
	CITY_INFO: "CITY_INFO",
	UID:"UID"
}


// const baseUrl = 'http://wap208.fntest.ifengniao.net:6001'
const baseUrl = 'https://m.ifengniao.net'

//人脸识别 回调地址
const faceReturnUrl = `${baseUrl}/pages/face-result/face-result`

//用户协议
const userAgreementUrl = 'http://mwebtest203.fntest.ifengniao.net:6001/mweb-html/notice/user-agreement.html'

//车损免赔
const damageUrl= 'https://ifengniao.net/mweb-html/notice/self-agreement.html'

//支付成功 回调地址
const payReturnUrl = `${baseUrl}/pages/result/result`

export { 
	localStorageKey,
	faceReturnUrl,
	userAgreementUrl,
	damageUrl,
	payReturnUrl
}

 
